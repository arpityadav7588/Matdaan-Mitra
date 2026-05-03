export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');


export const MOCK_TIMELINE = [
  { date: '2026-04-15', event: 'Voter List Revision', description: 'Verification of voter rolls across all constituencies.', status: 'completed' },
  { date: '2026-05-01', event: 'Nominations Start', description: 'Candidates begin filing their nomination papers.', status: 'upcoming' },
  { date: '2026-06-01', event: 'Polling Day', description: 'Nationwide voting across all states.', status: 'upcoming' }
] as const;

