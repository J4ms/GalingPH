import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(
  request: IncomingMessage & { body?: unknown; method?: string },
  response: ServerResponse,
): Promise<void>;
