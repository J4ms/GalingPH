const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 18 * 1024 * 1024;
const PREFERRED_MODELS = [
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.5-pro-latest',
  'models/gemini-2.0-flash-lite',
  'models/gemini-2.0-flash',
];

async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

function estimateBase64Bytes(data) {
  return Math.ceil((String(data || '').length * 3) / 4);
}

function buildPrompt(goal, files) {
  return `You are an AI file and picture scanner for GalingPH, a career and skills guidance app.

Scan the selected user-provided files only. Base the answer on visible/readable file contents, not guesses.

Return only valid JSON. Do not wrap it in markdown. Use this shape:
{
  "summary": "what the file/image appears to be and the most important details",
  "skillsDetected": ["skills, tools, certificates, job roles, school/training clues, or work experience visible in the upload"],
  "careerMatches": [{"name": "career or training path", "match": "85%"}],
  "skillGaps": ["skills the user should learn next for the target role/profile"],
  "tesdaRecommendations": ["specific TESDA-style course recommendations"],
  "nextActions": ["specific next steps for the user"]
}

Use 3 to 8 skills, 3 to 5 career matches, 3 to 6 skill gaps, and 3 to 6 TESDA recommendations. If the upload has no visible skills, keep skillsDetected empty and recommend exploratory TESDA paths.

User scan goal: ${goal || 'General scan and document understanding'}

Files selected by the user:
${files.map((file, index) => `${index + 1}. ${file.name} (${file.type || 'unknown MIME'})`).join('\n')}

Do not claim access to files that were not uploaded. If a file cannot be read, say so clearly. If uncertain, say "unclear" instead of inventing details.`;
}

async function listGenerateContentModels(apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Unable to list Google AI models.');
  }

  return (payload.models || [])
    .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
    .map((model) => model.name);
}

async function getCandidateModels(apiKey) {
  const availableModels = await listGenerateContentModels(apiKey);
  const availableSet = new Set(availableModels);
  const preferred = PREFERRED_MODELS.filter((model) => availableSet.has(model));
  const fallback = availableModels
    .filter((model) => /gemini/i.test(model))
    .sort((a, b) => {
      const score = (name) => {
        if (/flash/i.test(name)) return 0;
        if (/pro/i.test(name)) return 1;
        return 2;
      };
      return score(a) - score(b) || a.localeCompare(b);
    });

  return [...new Set([...preferred, ...fallback])];
}

async function generateWithAvailableModel(apiKey, requestBody) {
  const candidateModels = await getCandidateModels(apiKey);

  if (candidateModels.length === 0) {
    throw new Error('No Google AI models that support generateContent are available for this API key.');
  }

  let lastError = 'Google AI scan failed.';
  for (const model of candidateModels) {
    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const payload = await googleResponse.json();
    if (googleResponse.ok) {
      return { model, payload };
    }

    lastError = payload?.error?.message || lastError;
    const quotaOrRateLimit = googleResponse.status === 429 || /quota|rate.?limit/i.test(lastError);
    const canTryNext = googleResponse.status === 400 || googleResponse.status === 404 || quotaOrRateLimit;
    if (!canTryNext) {
      throw new Error(lastError);
    }
  }

  throw new Error(`${lastError}\n\nAll available Gemini models for this API key failed. If this is a quota error, enable billing or use a Google AI key/project with remaining Gemini API quota.`);
}

function parseJsonResult(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeAnalysis(parsed, resultText) {
  const analysis = parsed && typeof parsed === 'object' ? parsed : {};
  const skillsDetected = Array.isArray(analysis.skillsDetected) ? analysis.skillsDetected.filter(Boolean).slice(0, 12) : [];
  const careerMatches = Array.isArray(analysis.careerMatches) ? analysis.careerMatches.slice(0, 6).map((career, index) => ({
    name: career?.name || `Career Match ${index + 1}`,
    match: career?.match || `${Math.max(55, 88 - index * 7)}%`,
  })) : [];
  const skillGaps = Array.isArray(analysis.skillGaps) ? analysis.skillGaps.filter(Boolean).slice(0, 10) : [];
  const tesdaRecommendations = Array.isArray(analysis.tesdaRecommendations) ? analysis.tesdaRecommendations.filter(Boolean).slice(0, 10) : [];
  const nextActions = Array.isArray(analysis.nextActions) ? analysis.nextActions.filter(Boolean).slice(0, 8) : [];

  return {
    summary: analysis.summary || resultText,
    skillsDetected,
    careerMatches,
    skillGaps,
    tesdaRecommendations,
    nextActions,
  };
}

function formatAnalysis(analysis) {
  return [
    'File Summary',
    analysis.summary || 'No summary returned.',
    '',
    `Skills Detected (${analysis.skillsDetected.length})`,
    analysis.skillsDetected.length ? analysis.skillsDetected.map((skill) => `- ${skill}`).join('\n') : '- No clear skills detected.',
    '',
    'Best Matching Career Areas',
    analysis.careerMatches.length ? analysis.careerMatches.map((career) => `- ${career.name} (${career.match})`).join('\n') : '- Explore TESDA training paths to discover skills.',
    '',
    'Skill Gaps',
    analysis.skillGaps.length ? analysis.skillGaps.map((skill) => `- ${skill}`).join('\n') : '- No clear gaps detected yet.',
    '',
    'TESDA Recommendations',
    analysis.tesdaRecommendations.length ? analysis.tesdaRecommendations.map((course) => `- ${course}`).join('\n') : '- Start with an exploratory TESDA program aligned to your interests.',
    '',
    'Suggested Next Actions',
    analysis.nextActions.length ? analysis.nextActions.map((action) => `- ${action}`).join('\n') : '- Upload a clearer resume, certificate, or portfolio image for deeper analysis.',
  ].join('\n');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return sendJson(response, 500, { error: 'Google AI is not configured on the server.' });
  }

  try {
    const { goal = '', files = [] } = await readJsonBody(request);

    if (!Array.isArray(files) || files.length === 0) {
      return sendJson(response, 400, { error: 'At least one file is required.' });
    }

    if (files.length > MAX_FILES) {
      return sendJson(response, 400, { error: `Upload ${MAX_FILES} files or fewer per scan.` });
    }

    const totalBytes = files.reduce((sum, file) => sum + estimateBase64Bytes(file.data || file.text), 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      return sendJson(response, 413, { error: 'Selected files are too large for one scan.' });
    }

    const parts = [{ text: buildPrompt(goal, files) }];
    for (const file of files) {
      if (file.kind === 'text') {
        parts.push({ text: `\n--- ${file.name} ---\n${String(file.text || '').slice(0, 60000)}` });
        continue;
      }

      parts.push({
        inline_data: {
          mime_type: file.type || 'application/octet-stream',
          data: file.data,
        },
      });
    }

    const { model, payload } = await generateWithAvailableModel(apiKey, {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1400,
        responseMimeType: 'application/json',
      },
    });

    const result = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n') || 'No scan text was returned.';
    const analysis = normalizeAnalysis(parseJsonResult(result), result);

    return sendJson(response, 200, { result: formatAnalysis(analysis), analysis, model });
  } catch (error) {
    return sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unable to scan these files.',
    });
  }
}
