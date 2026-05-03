export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  symbol: string;
  education: string;
  criminalRecords: string;
  assets: string;
  manifestoUrl?: string;
}

export interface VoterRecord {
  name: string;
  booth: string;
  date: string;
  verified: boolean;
  constituency: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu';
