import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useUser } from '../UserContext';
import { readStorage, writeStorage } from '../storage';
import AiScanner from './AiScanner';

/* ── ICONS ── */
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
);
const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const FolderIcon = ({ color = 'var(--accent)' }) => (
  <svg viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   TESDA PROGRAMS DATA
   ══════════════════════════════════════════════════════════════ */
const TESDA_PROGRAMS = [
  // ── ICT (Information and Communications Technology) ──
  { name: 'Programming NC IV', sector: 'ICT', level: 'College', duration: '1,298 hrs', type: 'NC IV' },
  { name: 'Illustration NC II', sector: 'ICT', level: 'College', duration: '356 hrs', type: 'NC II' },
  { name: 'Web Development NC III', sector: 'ICT', level: 'College', duration: '486 hrs', type: 'NC III' },
  { name: 'Animation NC II', sector: 'ICT', level: 'College', duration: '1,150 hrs', type: 'NC II' },
  { name: 'Computer Systems Servicing NC II', sector: 'ICT', level: 'SHS', duration: '280 hrs', type: 'NC II' },
  { name: 'Contact Center Services NC II', sector: 'ICT', level: 'SHS', duration: '240 hrs', type: 'NC II' },
  { name: 'Medical Transcription NC II', sector: 'ICT', level: 'College', duration: '720 hrs', type: 'NC II' },
  { name: 'Telecom OSP and Subscriber Line Installation NC II', sector: 'ICT', level: 'SHS', duration: '162 hrs', type: 'NC II' },
  { name: 'Broadband Installation (Fixed Wireless Systems) NC II', sector: 'ICT', level: 'SHS', duration: '198 hrs', type: 'NC II' },
  { name: '2D Animation NC III', sector: 'ICT', level: 'College', duration: '596 hrs', type: 'NC III' },
  { name: '3D Animation NC III', sector: 'ICT', level: 'College', duration: '596 hrs', type: 'NC III' },
  { name: 'Visual Graphic Design NC III', sector: 'ICT', level: 'College', duration: '486 hrs', type: 'NC III' },
  { name: 'Game Development NC III', sector: 'ICT', level: 'College', duration: '486 hrs', type: 'NC III' },

  // ── Electronics ──
  { name: 'Electronics Products Assembly and Servicing NC II', sector: 'Electronics', level: 'SHS', duration: '260 hrs', type: 'NC II' },
  { name: 'Electronic/Computer Assembly and Servicing NC II', sector: 'Electronics', level: 'SHS', duration: '240 hrs', type: 'NC II' },
  { name: 'Mechatronics Servicing NC II', sector: 'Electronics', level: 'College', duration: '560 hrs', type: 'NC II' },
  { name: 'Instrumentation and Control Servicing NC II', sector: 'Electronics', level: 'College', duration: '480 hrs', type: 'NC II' },
  { name: 'Mechatronics Servicing NC III', sector: 'Electronics', level: 'College', duration: '360 hrs', type: 'NC III' },
  { name: 'Mechatronics Servicing NC IV', sector: 'Electronics', level: 'College', duration: '240 hrs', type: 'NC IV' },

  // ── Electrical and Power ──
  { name: 'Electrical Installation and Maintenance NC II', sector: 'Electrical', level: 'SHS', duration: '320 hrs', type: 'NC II' },
  { name: 'Electrical Installation and Maintenance NC III', sector: 'Electrical', level: 'College', duration: '240 hrs', type: 'NC III' },
  { name: 'Electrical Installation and Maintenance NC IV', sector: 'Electrical', level: 'College', duration: '120 hrs', type: 'NC IV' },
  { name: 'Photovoltaic Systems Installation NC II', sector: 'Electrical', level: 'College', duration: '116 hrs', type: 'NC II' },

  // ── Automotive ──
  { name: 'Automotive Servicing NC I', sector: 'Automotive', level: 'SHS', duration: '324 hrs', type: 'NC I' },
  { name: 'Automotive Servicing NC II', sector: 'Automotive', level: 'SHS', duration: '468 hrs', type: 'NC II' },
  { name: 'Automotive Servicing NC III', sector: 'Automotive', level: 'College', duration: '360 hrs', type: 'NC III' },
  { name: 'Automotive Servicing NC IV', sector: 'Automotive', level: 'College', duration: '240 hrs', type: 'NC IV' },
  { name: 'Motorcycle/Small Engine Servicing NC II', sector: 'Automotive', level: 'SHS', duration: '280 hrs', type: 'NC II' },
  { name: 'Driving NC II', sector: 'Automotive', level: 'SHS', duration: '118 hrs', type: 'NC II' },
  { name: 'Heavy Equipment Servicing NC II', sector: 'Automotive', level: 'College', duration: '480 hrs', type: 'NC II' },

  // ── Tourism ──
  { name: 'Food and Beverage Services NC II', sector: 'Tourism', level: 'SHS', duration: '356 hrs', type: 'NC II' },
  { name: 'Housekeeping NC II', sector: 'Tourism', level: 'SHS', duration: '436 hrs', type: 'NC II' },
  { name: 'Cookery NC II', sector: 'Tourism', level: 'SHS', duration: '316 hrs', type: 'NC II' },
  { name: 'Bread and Pastry Production NC II', sector: 'Tourism', level: 'SHS', duration: '141 hrs', type: 'NC II' },
  { name: 'Bartending NC II', sector: 'Tourism', level: 'SHS', duration: '226 hrs', type: 'NC II' },
  { name: 'Tour Guiding Services NC II', sector: 'Tourism', level: 'College', duration: '320 hrs', type: 'NC II' },
  { name: 'Travel Services NC II', sector: 'Tourism', level: 'College', duration: '320 hrs', type: 'NC II' },
  { name: 'Events Management Services NC III', sector: 'Tourism', level: 'College', duration: '320 hrs', type: 'NC III' },
  { name: 'Food and Beverage Services NC III', sector: 'Tourism', level: 'College', duration: '244 hrs', type: 'NC III' },
  { name: 'Commercial Cooking NC III', sector: 'Tourism', level: 'College', duration: '600 hrs', type: 'NC III' },

  // ── Health, Social, and Other Community Development ──
  { name: 'Hilot (Wellness Massage) NC II', sector: 'Health', level: 'SHS', duration: '120 hrs', type: 'NC II' },
  { name: 'Caregiving NC II', sector: 'Health', level: 'College', duration: '786 hrs', type: 'NC II' },
  { name: 'Health Care Services NC II', sector: 'Health', level: 'College', duration: '996 hrs', type: 'NC II' },
  { name: 'Barangay Health Services NC II', sector: 'Health', level: 'SHS', duration: '120 hrs', type: 'NC II' },
  { name: 'Emergency Medical Services NC II', sector: 'Health', level: 'College', duration: '240 hrs', type: 'NC II' },
  { name: 'Pharmacy Services NC III', sector: 'Health', level: 'College', duration: '600 hrs', type: 'NC III' },
  { name: 'Dental Hygiene NC IV', sector: 'Health', level: 'College', duration: '1,200 hrs', type: 'NC IV' },

  // ── Construction ──
  { name: 'Masonry NC II', sector: 'Construction', level: 'SHS', duration: '258 hrs', type: 'NC II' },
  { name: 'Carpentry NC II', sector: 'Construction', level: 'SHS', duration: '258 hrs', type: 'NC II' },
  { name: 'Plumbing NC II', sector: 'Construction', level: 'SHS', duration: '258 hrs', type: 'NC II' },
  { name: 'Tile Setting NC II', sector: 'Construction', level: 'SHS', duration: '166 hrs', type: 'NC II' },
  { name: 'Scaffold Erecting NC II', sector: 'Construction', level: 'SHS', duration: '82 hrs', type: 'NC II' },
  { name: 'Pipefitting NC II', sector: 'Construction', level: 'College', duration: '258 hrs', type: 'NC II' },
  { name: 'Heavy Equipment Operation NC II', sector: 'Construction', level: 'College', duration: '312 hrs', type: 'NC II' },
  { name: 'Construction Painting NC II', sector: 'Construction', level: 'SHS', duration: '194 hrs', type: 'NC II' },

  // ── TVET (Trainers Methodology) ──
  { name: 'Trainers Methodology I', sector: 'TVET', level: 'College', duration: '264 hrs', type: 'TM I' },
  { name: 'Trainers Methodology II', sector: 'TVET', level: 'College', duration: '196 hrs', type: 'TM II' },

  // ── Agriculture and Fishery ──
  { name: 'Agricultural Crops Production NC II', sector: 'Agriculture', level: 'SHS', duration: '320 hrs', type: 'NC II' },
  { name: 'Animal Production (Poultry-Chicken) NC II', sector: 'Agriculture', level: 'SHS', duration: '316 hrs', type: 'NC II' },
  { name: 'Animal Production (Swine) NC II', sector: 'Agriculture', level: 'SHS', duration: '316 hrs', type: 'NC II' },
  { name: 'Aquaculture NC II', sector: 'Agriculture', level: 'SHS', duration: '316 hrs', type: 'NC II' },
  { name: 'Landscape Installation and Maintenance NC II', sector: 'Agriculture', level: 'SHS', duration: '244 hrs', type: 'NC II' },
  { name: 'Organic Agriculture Production NC II', sector: 'Agriculture', level: 'College', duration: '232 hrs', type: 'NC II' },
  { name: 'Rice Machinery Operations NC II', sector: 'Agriculture', level: 'SHS', duration: '156 hrs', type: 'NC II' },
  { name: 'Horticulture NC III', sector: 'Agriculture', level: 'College', duration: '480 hrs', type: 'NC III' },
  { name: 'Agricultural Crops Production NC III', sector: 'Agriculture', level: 'College', duration: '232 hrs', type: 'NC III' },

  // ── Garments and Textile ──
  { name: 'Dressmaking NC II', sector: 'Garments', level: 'SHS', duration: '396 hrs', type: 'NC II' },
  { name: 'Tailoring NC II', sector: 'Garments', level: 'SHS', duration: '280 hrs', type: 'NC II' },
  { name: 'Fashion Design NC III', sector: 'Garments', level: 'College', duration: '480 hrs', type: 'NC III' },

  // ── Metals and Engineering ──
  { name: 'Shielded Metal Arc Welding (SMAW) NC I', sector: 'Metals', level: 'SHS', duration: '268 hrs', type: 'NC I' },
  { name: 'Shielded Metal Arc Welding (SMAW) NC II', sector: 'Metals', level: 'SHS', duration: '268 hrs', type: 'NC II' },
  { name: 'Gas Metal Arc Welding (GMAW) NC II', sector: 'Metals', level: 'College', duration: '268 hrs', type: 'NC II' },
  { name: 'Gas Tungsten Arc Welding (GTAW) NC II', sector: 'Metals', level: 'College', duration: '268 hrs', type: 'NC II' },
  { name: 'Machining NC II', sector: 'Metals', level: 'College', duration: '480 hrs', type: 'NC II' },
  { name: 'CNC Lathe Machine Operation NC II', sector: 'Metals', level: 'College', duration: '200 hrs', type: 'NC II' },
  { name: 'CNC Milling Machine Operation NC II', sector: 'Metals', level: 'College', duration: '200 hrs', type: 'NC II' },

  // ── Maritime ──
  { name: 'Ship Catering Services NC I', sector: 'Maritime', level: 'SHS', duration: '356 hrs', type: 'NC I' },
  { name: 'Marine Diesel Plant Maintenance NC I', sector: 'Maritime', level: 'College', duration: '480 hrs', type: 'NC I' },
  { name: 'Seafaring Ratings NC I', sector: 'Maritime', level: 'College', duration: '480 hrs', type: 'NC I' },

  // ── Processed Food and Beverages ──
  { name: 'Food Processing NC II', sector: 'Food Processing', level: 'SHS', duration: '356 hrs', type: 'NC II' },
  { name: 'Slaughtering Operations NC II', sector: 'Food Processing', level: 'College', duration: '160 hrs', type: 'NC II' },
  { name: 'Meat Processing NC II', sector: 'Food Processing', level: 'College', duration: '200 hrs', type: 'NC II' },

  // ── Social and Other Services ──
  { name: 'Beauty Care (Nail Care) Services NC II', sector: 'Services', level: 'SHS', duration: '120 hrs', type: 'NC II' },
  { name: 'Hairdressing NC II', sector: 'Services', level: 'SHS', duration: '356 hrs', type: 'NC II' },
  { name: 'Beauty Care Services NC III', sector: 'Services', level: 'College', duration: '600 hrs', type: 'NC III' },
  { name: 'Bookkeeping NC III', sector: 'Services', level: 'College', duration: '292 hrs', type: 'NC III' },
  { name: 'Security Services NC I', sector: 'Services', level: 'SHS', duration: '240 hrs', type: 'NC I' },
  { name: 'Security Services NC II', sector: 'Services', level: 'College', duration: '480 hrs', type: 'NC II' },
];

const SECTORS = [...new Set(TESDA_PROGRAMS.map(p => p.sector))].sort();

/* ── CAREER DATA ── */
const careerRows = [
  { name: 'Software Engineer', type: 'folder', match: '94%', status: 'Strong Match', skills: 3, modified: 'Today', sharing: [{ i: 'JD', c: '#00C98A' }, { i: 'MS', c: '#3B00FF' }], tags: ['ICT', 'DOLE'], skillsList: ['React.js', 'Node.js', 'SQL'], trainings: ['Programming NC IV', 'Web Development NC III'] },
  { name: 'Web Developer', type: 'folder', match: '81%', status: 'Good Match', skills: 5, modified: 'Yesterday', sharing: [{ i: 'JD', c: '#00C98A' }], tags: ['ICT', 'TESDA'], skillsList: ['React.js', 'Node.js', 'SQL', 'REST APIs', 'TypeScript'], trainings: ['Web Development NC III', 'Programming NC IV', 'Visual Graphic Design NC III'] },
  { name: 'Bookkeeper', type: 'folder', match: '73%', status: 'Partial Match', skills: 8, modified: 'Apr 10', sharing: [], tags: ['Services', 'DOLE'], skillsList: ['Accounting', 'Excel', 'QuickBooks', 'Tax Filing', 'Payroll', 'Auditing', 'Financial Reports', 'Data Entry'], trainings: ['Bookkeeping NC III'] },
  { name: 'Graphic Designer', type: 'file', match: '68%', status: 'Partial Match', skills: 6, modified: 'Apr 2', sharing: [{ i: 'AM', c: '#E85D24' }, { i: 'JD', c: '#00C98A' }, { i: 'MS', c: '#3B00FF' }], tags: ['ICT', 'Creative'], skillsList: ['Adobe Photoshop', 'Illustrator', 'Figma', 'Typography', 'Branding', 'UI Design'], trainings: ['Illustration NC II', 'Visual Graphic Design NC III', '2D Animation NC III'] },
  { name: 'Electrician', type: 'file', match: '61%', status: 'Partial Match', skills: 9, modified: 'Mar 15', sharing: [{ i: 'JD', c: '#00C98A' }], tags: ['Electrical', 'TESDA'], skillsList: ['Wiring', 'Circuit Design', 'Safety Protocols', 'PLC', 'Motor Control', 'Troubleshooting', 'Blueprint Reading', 'Grounding', 'Panel Installation'], trainings: ['Electrical Installation and Maintenance NC II', 'Electrical Installation and Maintenance NC III', 'Photovoltaic Systems Installation NC II'] },
  { name: 'Automotive Mechanic', type: 'file', match: '58%', status: 'Partial Match', skills: 10, modified: 'Mar 10', sharing: [], tags: ['Automotive', 'TESDA'], skillsList: ['Engine Repair', 'Brake Systems', 'Transmission', 'Diagnostics', 'Electrical Systems', 'Suspension', 'AC Systems', 'Fuel Injection', 'Welding', 'Hydraulics'], trainings: ['Automotive Servicing NC II', 'Automotive Servicing NC III', 'Motorcycle/Small Engine Servicing NC II'] },
  { name: 'Chef / Cook', type: 'file', match: '76%', status: 'Good Match', skills: 4, modified: 'Feb 28', sharing: [], tags: ['Tourism', 'TESDA'], skillsList: ['Knife Skills', 'Menu Planning', 'Food Safety', 'Plating'], trainings: ['Cookery NC II', 'Commercial Cooking NC III', 'Bread and Pastry Production NC II'] },
  { name: 'Healthcare Worker', type: 'file', match: '55%', status: 'Low Match', skills: 12, modified: 'Feb 22', sharing: [], tags: ['Health', 'DOLE'], skillsList: ['Patient Care', 'Vital Signs', 'First Aid', 'CPR', 'Medical Records', 'Infection Control', 'Medication Admin', 'Wound Care', 'Communication', 'Anatomy', 'Pharmacology', 'Ethics'], trainings: ['Caregiving NC II', 'Health Care Services NC II', 'Emergency Medical Services NC II', 'Barangay Health Services NC II'] },
  { name: 'Welder', type: 'file', match: '64%', status: 'Partial Match', skills: 7, modified: 'Feb 15', sharing: [], tags: ['Metals', 'TESDA'], skillsList: ['SMAW', 'GMAW', 'GTAW', 'Blueprint Reading', 'Metal Cutting', 'Safety', 'Quality Inspection'], trainings: ['Shielded Metal Arc Welding (SMAW) NC II', 'Gas Metal Arc Welding (GMAW) NC II', 'Gas Tungsten Arc Welding (GTAW) NC II'] },
  { name: 'TESDA Trainer', type: 'file', match: '79%', status: 'Good Match', skills: 4, modified: 'Feb 10', sharing: [], tags: ['TVET', 'Education'], skillsList: ['Curriculum Design', 'Assessment', 'Facilitation', 'CBT Methodology'], trainings: ['Trainers Methodology I', 'Trainers Methodology II'] },
];

const quickAccessCards = [
  { name: 'Software Engineer', meta: '94% match · 3 skills to go', color: '#00C98A' },
  { name: 'Web Developer', meta: '81% match · 5 skills to go', color: '#3B00FF' },
  { name: 'Chef / Cook', meta: '76% match · 4 skills to go', color: '#E85D24' },
  { name: 'AI Scanner', meta: 'Scan files and photos securely', color: '#3B00FF', tab: 'AI Scanner' },
];


export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { user, logout, notifications, markNotificationRead, clearAllNotifications, analyzeResume, analyzeCertificate, analysisResult, isAdmin, profileSettings, updateProfileSettings } = useUser();
  const [activeRow, setActiveRow] = useState(0);
  const [activeTab, setActiveTab] = useState('Activity');
  const [sidebarActive, setSidebarActive] = useState('AI Scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [trainingSector, setTrainingSector] = useState('All');
  const [trainingLevel, setTrainingLevel] = useState('All');
  const [trainingSearch, setTrainingSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [settings, setSettings] = useState(() => {
    const stored = readStorage('galingph-settings');
    return stored ? stored : {
      displayName: '',
      bio: '',
      location: '',
      targetRole: '',
      emailNotifications: true,
      pushNotifications: true,
      careerAlerts: true,
      trainingReminders: true,
      profileVisibility: 'public',
      language: 'en',
    };
  });
  const resumeInputRef = useRef();
  const certInputRef = useRef();
  const profilePhotoInputRef = useRef();

  const userName = profileSettings?.displayName || user?.name || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const userEmail = profileSettings?.email || user?.email || '';
  const userPicture = profileSettings?.picture || user?.picture || '';
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      displayName: profileSettings?.displayName || user?.name || '',
      bio: profileSettings?.bio || '',
      location: profileSettings?.location || '',
      targetRole: profileSettings?.targetRole || '',
    }));
  }, [profileSettings?.displayName, profileSettings?.bio, profileSettings?.location, profileSettings?.targetRole, user?.name]);

  const renderAvatar = (size = 32, fontSize = 12, extraStyle = {}) => (
    <div className="avatar" style={{ width: size, height: size, fontSize, overflow: 'hidden', ...extraStyle }}>
      {userPicture ? <img src={userPicture} alt={userName} /> : userInitials}
    </div>
  );

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      analyzeResume(file.name);
      setAnalyzing(false);
      setSidebarActive('Skills Gap');
    }, 2000);
  };

  const handleCertUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      analyzeCertificate(file.name);
      setAnalyzing(false);
    }, 1500);
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateProfileSettings?.({ picture: String(reader.result) });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const saveProfileSettings = () => {
    writeStorage('galingph-settings', settings);
    updateProfileSettings?.({
      displayName: settings.displayName || user.name || '',
      email: user.email || '',
      bio: settings.bio || '',
      location: settings.location || '',
      targetRole: settings.targetRole || '',
    });
    setShowSettings(false);
  };

  const scannedCareerRows = analysisResult?.source === 'AI Scanner'
    ? (analysisResult.recommendedCareers || []).map((career, index) => ({
        name: career.name,
        type: 'folder',
        match: career.match || `${Math.max(55, 88 - index * 7)}%`,
        status: index === 0 ? 'Best Scan Match' : 'Scan Match',
        skills: analysisResult.skillGaps?.length || Math.max(1, 6 - (analysisResult.extractedSkills?.length || 0)),
        modified: 'Just now',
        sharing: [],
        tags: ['AI Scan', 'TESDA'],
        skillsList: analysisResult.skillGaps?.length ? analysisResult.skillGaps : ['Career exploration', 'Digital literacy', 'Communication', 'Portfolio building'],
        trainings: analysisResult.tesdaRecommendations?.length
          ? analysisResult.tesdaRecommendations
          : ['Computer Systems Servicing NC II', 'Bookkeeping NC III', 'Contact Center Services NC II'],
      }))
    : [];
  const careerDisplayRows = scannedCareerRows.length ? scannedCareerRows : careerRows;
  const selectedRow = careerDisplayRows[Math.min(activeRow, careerDisplayRows.length - 1)] || careerRows[0];

  const renderNotificationsMenu = (mobile = false) => {
    const menuStyle = {
      position: 'absolute',
      top: mobile ? 56 : 44,
      right: mobile ? 16 : 0,
      left: mobile ? 16 : 'auto',
      width: mobile ? 'auto' : 340,
      maxWidth: mobile ? 'calc(100vw - 32px)' : 340,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
      zIndex: 120,
      overflow: 'hidden',
    };

    return (
      <div style={menuStyle}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
          {notifications.length > 0 && (
            <button onClick={clearAllNotifications} style={{ background: 'transparent', border: 'none', fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
              Clear All
            </button>
          )}
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'var(--border)' : 'var(--accent)', marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{n.time}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); markNotificationRead(n.id); }} style={{ background: 'transparent', border: 'none', fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer', padding: '0 4px' }} title="Dismiss">×</button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProfileMenu = (mobile = false) => {
    const menuStyle = {
      position: 'absolute',
      top: mobile ? 56 : 44,
      right: mobile ? 16 : 0,
      left: mobile ? 16 : 'auto',
      width: mobile ? 'auto' : 260,
      maxWidth: mobile ? 'calc(100vw - 32px)' : 260,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
      zIndex: 120,
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    };

    return (
      <div style={menuStyle}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {renderAvatar(40, 14)}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{userName}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{userEmail}</div>
          </div>
        </div>
        <div style={{ padding: '6px 0' }}>
          {[
            { label: 'My Profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, action: () => setShowProfileView(true) },
            { label: 'Change Profile Picture', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>, action: () => profilePhotoInputRef.current?.click() },
            { label: 'Upload Resume', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/></svg>, action: () => resumeInputRef.current?.click() },
            { label: 'Upload Certificate', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>, action: () => certInputRef.current?.click() },
            { label: 'Settings', icon: <SettingsIcon />, action: () => setShowSettings(true) },
            ...(isAdmin ? [{ label: 'Admin Panel', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, action: () => navigate('/admin') }] : []),
          ].map(item => (
            <button key={item.label} onClick={() => { item.action(); setShowProfile(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'left', transition: 'background 0.15s, color 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', padding: '6px 0' }}>
          <button onClick={handleSignOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#E85D24', textAlign: 'left', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOutIcon /></span>
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    { label: 'AI Scanner', icon: <SearchIcon /> },
    { label: 'Career Paths', icon: <TargetIcon /> },
    { label: 'Skills Gap', icon: <StarIcon /> },
    { label: 'Training', icon: <BookIcon /> },
    { label: 'Jobs (PESO)', icon: <BriefcaseIcon /> },
  ];

  const filteredRows = careerDisplayRows.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPrograms = TESDA_PROGRAMS.filter(p => {
    const matchSector = trainingSector === 'All' || p.sector === trainingSector;
    const matchLevel = trainingLevel === 'All' || p.level === trainingLevel;
    const matchSearch = p.name.toLowerCase().includes(trainingSearch.toLowerCase());
    return matchSector && matchLevel && matchSearch;
  });

  /* ── RENDER MAIN CONTENT BASED ON SIDEBAR ── */
  const renderContent = () => {
    switch (sidebarActive) {
      case 'AI Scanner':
        return <AiScanner embedded />;
      case 'Career Paths':
        return renderCareerPathsView();
      case 'Skills Gap':
        return renderSkillsGapView();
      case 'Training':
        return renderTrainingView();
      case 'Jobs (PESO)':
        return renderJobsView();
      default:
        return <AiScanner embedded />;
    }
  };

  const renderDashboardView = () => (
    <>
      {/* Analyzing overlay */}
      {analyzing && (
        <div style={{ background: 'var(--grad-soft)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>AI is analyzing your document...</div>
        </div>
      )}

      {/* Welcome banner */}
      <div style={{ background: 'var(--grad-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Welcome{analysisResult ? ' back' : ''}, {userName.split(' ')[0]}!
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {analysisResult
              ? <>Your career readiness score is <strong style={{ color: 'var(--accent)' }}>{analysisResult.readinessScore}/100</strong>. Keep going!</>
              : 'Upload your resume and certificates to get started with AI career analysis.'
            }
          </div>
        </div>
        {analysisResult && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700 }} className="grad-text">{analysisResult.readinessScore}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>/100</span>
          </div>
        )}
      </div>

      {/* Empty state — no analysis yet */}
      {!analysisResult && !analyzing && (
        <div style={{ background: 'var(--bg-surface)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Get Started with AI Analysis
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Upload your resume or TESDA certificates and our AI will extract your skills, calculate your career readiness score, and recommend the best career paths for you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ height: 44, padding: '0 20px', fontSize: 14 }} onClick={() => resumeInputRef.current?.click()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Upload Resume
            </button>
            <button className="btn-secondary" style={{ height: 44, padding: '0 20px', fontSize: 14 }} onClick={() => certInputRef.current?.click()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Upload Certificate
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 16 }}>
            Supported: PDF, DOCX, JPG, PNG · Max 5MB
          </div>
        </div>
      )}

      {/* AI Analysis Result — only shown after upload */}
      {analysisResult && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div className="section-header"><span className="section-title">AI Analysis Result</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Analyzed: {analysisResult.fileName} · {analysisResult.analyzedAt}</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Extracted Skills ({analysisResult.extractedSkills.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {analysisResult.extractedSkills.map(s => <span key={s} className="badge badge-green">{s}</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recommended Careers</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {analysisResult.recommendedCareers.map(c => (
                <div key={c.name} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setSidebarActive('Career Paths')}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</span>
                  <span className="badge badge-green" style={{ fontSize: 10 }}>{c.match}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Access — only show after analysis */}
      {analysisResult && (
      <div>
        <div className="section-header">
          <span className="section-title">Quick Access</span>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><MoreIcon /></button>
        </div>
        <div className="quick-access-grid">
          {quickAccessCards.map(c => (
            <div key={c.name} className="quick-card" onClick={() => { if (c.route) navigate(c.route); else setSidebarActive(c.tab || 'Career Paths'); }}>
              <div className="quick-card-icon"><FolderIcon color={c.color} /></div>
              <div className="quick-card-name">{c.name}</div>
              <div className="quick-card-meta">{c.meta}</div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Recent Activity — synced to user's actual notifications */}
      {notifications.length > 0 && (
      <div>
        <div className="section-header">
          <span className="section-title">Recent Activity</span>
        </div>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div className="activity-list">
            {notifications.slice(0, 6).map((n) => (
              <div key={n.id} className="activity-item">
                <div className={`activity-dot${!n.read ? ' active' : ''}`} />
                <div>
                  <div className="activity-date">{n.time}</div>
                  <div className="activity-text">{n.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </>
  );

  const renderCareerPathsView = () => {
    if (!analysisResult) {
      return (
        <div style={{ background: 'var(--bg-surface)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Career Matches Yet</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Upload your resume or certificates so our AI can analyze your skills and recommend career paths with match percentages.
          </p>
          <button className="btn-primary" style={{ height: 44, padding: '0 20px', fontSize: 14 }} onClick={() => resumeInputRef.current?.click()}>
            <PlusIcon /> Upload Resume to Get Matches
          </button>
        </div>
      );
    }

    return (
    <>
      {/* Career Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="breadcrumb">
            <span>Home</span><ChevronRight />
            <span className="breadcrumb-sep">Career Analysis</span><ChevronRight />
            <span className="breadcrumb-current">All Matches</span>
          </div>
          <div className="table-actions">
            <button className="btn-secondary"><GridIcon /> View</button>
            <button className="btn-primary" onClick={() => resumeInputRef.current?.click()}><PlusIcon /> Add New</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Career Name</th>
              <th>Match Score</th>
              <th>Status</th>
              <th>Skills Gap</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const realIndex = careerDisplayRows.indexOf(row);
              return (
                <tr key={row.name} className={activeRow === realIndex ? 'active-row' : ''} onClick={() => { setActiveRow(realIndex); setShowRightPanel(true); }}>
                  <td>
                    <div className="td-name">
                      <div className="td-icon" style={{ background: row.type === 'folder' ? 'var(--accent-light)' : 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        {row.type === 'folder' ? <FolderIcon color="var(--accent)" /> : <FileIcon />}
                      </div>
                      {row.name}
                    </div>
                  </td>
                  <td><span className={`badge ${row.match >= '80%' ? 'badge-green' : row.match >= '65%' ? 'badge-blue' : 'badge-muted'}`}>{row.match}</span></td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.status}</span></td>
                  <td>{row.skills} skills</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{row.modified}</td>
                  <td><button className="row-menu-btn"><MoreIcon /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
    );
  };

  const renderSkillsGapView = () => {
    if (!analysisResult) {
      return (
        <div style={{ background: 'var(--bg-surface)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Skills Data Yet</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Upload your resume so our AI can identify your current skills and show you exactly what you need to learn for your target career.
          </p>
          <button className="btn-primary" style={{ height: 44, padding: '0 20px', fontSize: 14 }} onClick={() => resumeInputRef.current?.click()}>
            Upload Resume to Analyze Skills
          </button>
        </div>
      );
    }

    return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="section-header"><span className="section-title">Skills Gap Analysis</span></div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Based on your AI analysis — showing your current skills vs. what top careers require.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Skills You Have (from AI analysis) */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Skills You Have ({analysisResult.extractedSkills.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analysisResult.extractedSkills.length === 0 && (
              <div style={{ padding: '12px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                No clear skills were detected from the uploaded file. Start with the TESDA recommendations below to explore your interests and build a baseline skill profile.
              </div>
            )}
            {analysisResult.extractedSkills.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--accent-light)', borderRadius: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills You Need (from selected career) */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#E85D24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Skills You Need ({selectedRow.skillsList.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedRow.skillsList.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E85D24' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', cursor: 'pointer' }} onClick={() => setSidebarActive('Training')}>Find Training →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommended Career + Trainings */}
      <div style={{ marginTop: 20 }}>
        <div className="section-header"><span className="section-title">AI Recommended Careers & Trainings</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          {analysisResult.recommendedCareers.map(c => (
            <div key={c.name} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', flex: '1 1 200px', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{c.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-green">{c.match} match</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recommended for you</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {selectedRow.trainings.map(t => {
            const program = TESDA_PROGRAMS.find(p => p.name === t);
            return (
              <div key={t} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', flex: '1 1 280px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{t}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {program && <span className="badge badge-green">{program.type}</span>}
                  {program && <span className="badge badge-blue">{program.level}</span>}
                  {program && <span className="badge badge-muted">{program.duration}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
    );
  };

  const renderTrainingView = () => (
    <div className="training-view">
      <div className="training-controls">
        <div className="section-header"><span className="section-title">TESDA Training Programs</span></div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Browse {TESDA_PROGRAMS.length} accredited TESDA programs across all sectors. Filter by level (SHS NC / College) and sector.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', flex: '1 1 200px', maxWidth: 320 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search programs..." value={trainingSearch} onChange={e => setTrainingSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', width: '100%' }} />
          </div>
          <select value={trainingSector} onChange={e => setTrainingSector(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', height: 36 }}>
            <option value="All">All Sectors</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={trainingLevel} onChange={e => setTrainingLevel(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', height: 36 }}>
            <option value="All">All Levels</option>
            <option value="SHS">SHS (Senior High)</option>
            <option value="College">College</option>
          </select>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
          Showing {filteredPrograms.length} of {TESDA_PROGRAMS.length} programs
        </div>
      </div>

      {/* Programs Table */}
      <div className="table-container training-table-container">
        <table>
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Type</th>
              <th>Sector</th>
              <th>Level</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((p, i) => (
              <tr key={i}>
                <td><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span></td>
                <td><span className={`badge ${p.type.includes('IV') ? 'badge-green' : p.type.includes('III') ? 'badge-blue' : 'badge-muted'}`}>{p.type}</span></td>
                <td style={{ fontSize: 12 }}>{p.sector}</td>
                <td><span className={`badge ${p.level === 'College' ? 'badge-blue' : 'badge-green'}`}>{p.level}</span></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJobsView = () => {
    const jobs = [
      { title: 'Junior Software Developer', company: 'Accenture Philippines', location: 'BGC, Taguig', type: 'Full-time', salary: '₱25,000 - ₱40,000' },
      { title: 'Web Developer', company: 'Freelancer.com', location: 'Remote', type: 'Freelance', salary: '₱20,000 - ₱35,000' },
      { title: 'IT Support Specialist', company: 'DOST-ASTI', location: 'Quezon City', type: 'Full-time', salary: '₱18,000 - ₱28,000' },
      { title: 'Graphic Designer', company: 'Canva Philippines', location: 'Makati', type: 'Full-time', salary: '₱22,000 - ₱35,000' },
      { title: 'Electrician', company: 'Meralco', location: 'Pasig', type: 'Full-time', salary: '₱18,000 - ₱25,000' },
      { title: 'Automotive Technician', company: 'Toyota Motor Philippines', location: 'Santa Rosa, Laguna', type: 'Full-time', salary: '₱16,000 - ₱24,000' },
      { title: 'Cook / Kitchen Staff', company: 'Jollibee Foods Corp', location: 'Multiple Locations', type: 'Full-time', salary: '₱14,000 - ₱18,000' },
      { title: 'Caregiver', company: 'St. Luke\'s Medical Center', location: 'Quezon City', type: 'Full-time', salary: '₱15,000 - ₱22,000' },
      { title: 'Welder', company: 'HHIC-Phil Inc.', location: 'Subic, Zambales', type: 'Full-time', salary: '₱16,000 - ₱28,000' },
      { title: 'TESDA Trainer / Assessor', company: 'TESDA Regional Office', location: 'Various', type: 'Contract', salary: '₱20,000 - ₱30,000' },
    ];

    return (
      <>
        <div style={{ marginBottom: 16 }}>
          <div className="section-header"><span className="section-title">Job Opportunities (PESO)</span></div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Jobs matched to your skills and career path from PESO and partner employers.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map((job, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.15s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{job.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{job.company} · {job.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{job.salary}</div>
                <span className={`badge ${job.type === 'Full-time' ? 'badge-green' : job.type === 'Freelance' ? 'badge-blue' : 'badge-muted'}`}>{job.type}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="app-shell">
      {/* ── MOBILE TOP BAR ── */}
      <div className="mobile-topbar" style={{ position: 'relative' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>
          <span className="grad-text">GalingPH</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="topbar-icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} style={{ position: 'relative', width: 36, height: 36 }}>
            <BellIcon />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: '#E85D24' }} />}
          </button>
          <button style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }} onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>
            {renderAvatar(32, 11)}
          </button>
        </div>
        {showNotifications && renderNotificationsMenu(true)}
        {showProfile && renderProfileMenu(true)}
      </div>
      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* Top bar */}
        <div className="topbar">
          <div style={{ padding: '0 14px 0 0', marginRight: 8, borderRight: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>
            <span className="grad-text">GalingPH</span>
          </div>
          <div className="topbar-nav">
            {sidebarItems.map(t => (
              <button key={t.label} className={`topbar-nav-item${sidebarActive === (t.tab || t.label) ? ' active' : ''}`} onClick={() => setSidebarActive(t.tab || t.label)}>
                {sidebarActive === (t.tab || t.label) && t.icon}
                {t.label}
              </button>
            ))}
          </div>
          <div className="topbar-search">
            <SearchIcon />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', width: '100%' }} />
          </div>
          <div className="topbar-actions" style={{ position: 'relative' }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="topbar-icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} style={{ position: 'relative' }}>
                <BellIcon />
                {unreadCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#E85D24' }} />}
              </button>
              {showNotifications && renderNotificationsMenu()}
            </div>

            <button className="theme-toggle" onClick={toggle} style={{ width: 32, height: 32 }}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Profile Avatar + Dropdown */}
            <div style={{ position: 'relative' }}>
              <button title={userName} onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
                {renderAvatar(32, 12)}
              </button>
              {showProfile && renderProfileMenu()}
            </div>

            {/* Hidden file inputs */}
            <input ref={resumeInputRef} type="file" accept=".pdf,.docx" hidden onChange={handleResumeUpload} />
            <input ref={certInputRef} type="file" accept=".pdf,.jpg,.png" hidden onChange={handleCertUpload} />
            <input ref={profilePhotoInputRef} type="file" accept="image/*" hidden onChange={handleProfilePhotoUpload} />
          </div>
        </div>

        {/* Content */}
        <div className="content-scroll">
          {renderContent()}
        </div>
      </div>

      {/* ── RIGHT PANEL (Career Paths view only, after analysis) ── */}
      {showRightPanel && sidebarActive === 'Career Paths' && analysisResult && (
        <div className="right-panel">
          <div className="right-panel-header">
            <div>
              <div className="right-panel-title">{selectedRow.name}</div>
              <div className="detail-meta">{selectedRow.match} match · {selectedRow.skills} skills gap</div>
            </div>
            <button className="right-panel-close" onClick={() => setShowRightPanel(false)}>✕</button>
          </div>

          <div className="detail-tabs">
            {['Activity', 'Skills', 'Training'].map(t => (
              <button key={t} className={`detail-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>

          <div className="right-panel-body">
            {activeTab === 'Activity' && (
              <>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags</div>
                  <div className="detail-tags">
                    {selectedRow.tags.map(tag => (
                      <span key={tag} className={`badge ${tag === 'TESDA' || tag === 'DOLE' ? 'badge-green' : 'badge-blue'}`}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Career Readiness</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700 }} className="grad-text">{parseInt(selectedRow.match)}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>/ 100</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: selectedRow.match, background: 'var(--grad-primary)', borderRadius: 3 }} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Skills' && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Missing Skills ({selectedRow.skillsList.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedRow.skillsList.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E85D24' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Training' && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recommended Trainings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedRow.trainings.map(t => {
                    const prog = TESDA_PROGRAMS.find(p => p.name === t);
                    return (
                      <div key={t} style={{ padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{t}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {prog && <span className="badge badge-green" style={{ fontSize: 9 }}>{prog.type}</span>}
                          {prog && <span className="badge badge-muted" style={{ fontSize: 9 }}>{prog.duration}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* PROFILE VIEW MODAL */}
      {showProfileView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowProfileView(false)}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>My Profile</div>
              <button onClick={() => setShowProfileView(false)} style={{ background: 'transparent', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {renderAvatar(64, 22)}
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{userName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{userEmail}</div>
                  {isAdmin && <span className="badge badge-blue" style={{ marginTop: 6, display: 'inline-block' }}>Admin</span>}
                  <button onClick={() => profilePhotoInputRef.current?.click()} style={{ marginTop: 10, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Change Profile Picture</button>
                </div>
              </div>

              {/* Bio */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Bio</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {profileSettings?.bio || settings.bio || 'No bio yet. Go to Settings to add one.'}
                </div>
              </div>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Location</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{profileSettings?.location || settings.location || 'Not set'}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Member Since</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{new Date().toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Readiness Score</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }} className="grad-text">{analysisResult?.readinessScore || '—'}/100</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Skills Found</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{analysisResult?.extractedSkills?.length || 0}</div>
                </div>
              </div>

              {/* Skills */}
              {analysisResult?.extractedSkills?.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>My Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {analysisResult.extractedSkills.map(s => <span key={s} className="badge badge-green">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Recommended Careers */}
              {analysisResult?.recommendedCareers?.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Top Career Matches</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {analysisResult.recommendedCareers.map(c => (
                      <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</span>
                        <span className="badge badge-green">{c.match}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!analysisResult && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Upload your resume to see your skills and career matches here.</div>
                  <button className="btn-primary" style={{ height: 40, padding: '0 20px', fontSize: 13 }} onClick={() => { setShowProfileView(false); resumeInputRef.current?.click(); }}>Upload Resume</button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => { setShowProfileView(false); setShowSettings(true); }} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Edit Profile</button>
              <button onClick={() => setShowProfileView(false)} className="btn-primary" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13 }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ── */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowSettings(false)}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Settings</div>
              <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Profile Section */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Profile</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Display Name</label>
                    <input type="text" value={settings.displayName || userName} onChange={e => setSettings(prev => ({ ...prev, displayName: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Bio</label>
                    <textarea value={settings.bio} onChange={e => setSettings(prev => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', fontFamily: 'var(--font-body)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Location</label>
                    <input type="text" value={settings.location} onChange={e => setSettings(prev => ({ ...prev, location: e.target.value }))} placeholder="City, Province" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Target Role</label>
                    <input type="text" value={settings.targetRole || ''} onChange={e => setSettings(prev => ({ ...prev, targetRole: e.target.value }))} placeholder="Example: AI Engineer" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14 }} />
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Notifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'careerAlerts', label: 'Career Match Alerts', desc: 'Get notified of new career matches' },
                    { key: 'trainingReminders', label: 'Training Reminders', desc: 'Reminders for TESDA courses' },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                      <button onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: settings[item.key] ? 'var(--accent)' : 'var(--border)', position: 'relative', transition: 'background 0.2s' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings[item.key] ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Section */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Privacy</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Profile Visibility</label>
                    <select value={settings.profileVisibility} onChange={e => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14 }}>
                      <option value="public">Public — Anyone can see your profile</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private — Only you</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Language</label>
                    <select value={settings.language} onChange={e => setSettings(prev => ({ ...prev, language: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14 }}>
                      <option value="en">English</option>
                      <option value="fil">Filipino (Tagalog)</option>
                      <option value="ceb">Cebuano</option>
                      <option value="ilo">Ilocano</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Appearance</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { if (theme === 'dark') toggle(); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: theme === 'light' ? '2px solid var(--accent)' : '1px solid var(--border)', background: '#F0FAF7', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>☀️</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#080F1A' }}>Light</div>
                  </button>
                  <button onClick={() => { if (theme === 'light') toggle(); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: theme === 'dark' ? '2px solid var(--accent)' : '1px solid var(--border)', background: '#0C1A1C', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>🌙</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#E8F8F4' }}>Dark</div>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#E85D24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Danger Zone</div>
                <div style={{ padding: '14px 16px', background: 'rgba(232,93,36,0.05)', border: '1px solid rgba(232,93,36,0.2)', borderRadius: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>Delete Account</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Permanently delete your account and all associated data. This action cannot be undone.</div>
                  <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E85D24', background: 'transparent', color: '#E85D24', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete My Account</button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowSettings(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveProfileSettings} className="btn-primary" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



