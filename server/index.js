const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { getElectionInfo } = require('./ai.service');
const { hashVoterId } = require('./src/utils/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock Election Commission Data
const mockVoterDatabase = {
  // SHA-256 hashed 'ABC1234567'
  '2d711642b726b04401627ca9fbac32f5c85303956477b8222a0a5019f2cc9281': {
    name: 'Rahul Kumar',
    constituency: 'New Delhi',
    status: 'Active',
    pollingStation: 'Govt. Senior Secondary School, Sector 4'
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/eligibility', (req, res) => {
  const { hashedId } = req.body;
  if (!hashedId || hashedId.length !== 64) {
    return res.status(400).json({ success: false, message: 'Invalid or missing hashed Voter ID' });
  }

  const voter = mockVoterDatabase[hashedId];
  if (voter) {
    res.json({ success: true, data: voter });
  } else {
    res.status(404).json({ success: false, message: 'Voter record not found for this hashed ID' });
  }
});


app.get('/api/timeline', (req, res) => {
  res.json([
    { date: '2026-04-15', event: 'Voter List Revision Ends', description: 'Final check for name in voter list' },
    { date: '2026-05-01', event: 'Candidate Nominations Open', description: 'Candidates file their papers' },
    { date: '2026-05-15', event: 'Withdrawal Deadline', description: 'Last date to withdraw nomination' },
    { date: '2026-06-01', event: 'Polling Day', description: 'Cast your vote at your booth' },
    { date: '2026-06-05', event: 'Result Declaration', description: 'Counting of votes and results' }
  ]);
});

app.get('/api/candidates', (req, res) => {
  const { constituency } = req.query;
  // Mock data for demo
  res.json([
    { id: 1, name: 'Aditi Sharma', party: 'Progressive Party', symbol: '💡', education: 'MBA, IIM Ahmedabad', criminalRecords: 'None', manifestLink: '#' },
    { id: 2, name: 'Suresh Singh', party: 'Jan Shakti', symbol: '🚜', education: 'B.Sc Agriculture', criminalRecords: 'None', manifestLink: '#' },
    { id: 3, name: 'Dr. Meera Iyer', party: 'Independent', symbol: '🏥', education: 'PhD Public Health', criminalRecords: 'None', manifestLink: '#' }
  ]);
});

app.post('/api/chat', async (req, res) => {
  const { query, mode } = req.body;
  if (!query || query.length > 500) {
    return res.status(400).json({ success: false, message: 'Query too long or empty' });
  }
  try {
    const response = await getElectionInfo(query, mode);
    res.json({ success: true, response });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ success: false, message: 'AI Assistant is temporarily unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`Matdaan Mitra Server running on port ${PORT}`);
});

