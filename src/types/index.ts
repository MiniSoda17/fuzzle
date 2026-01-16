export type ActivityType = 'study' | 'hoops' | 'coffee' | 'walk' | 'food';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // URL or placeholder color
  major: string;
  bio: string;
  lat: number;
  lng: number;
  isOnline: boolean;
}

export interface MeetupRequest {
  id: string;
  fromUser: User;
  toUser: User;
  activity: ActivityType;
  location?: string; // Proposed location
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: number; // Timestamp
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice',
    major: 'Computer Science',
    bio: 'Coding and coffee ☕️',
    lat: 51.505,
    lng: -0.09,
    isOnline: true
  },
  {
    id: '2',
    name: 'Bob',
    major: 'Physics',
    bio: 'Looking for a tennis partner 🎾',
    lat: 51.51,
    lng: -0.1,
    isOnline: true
  },
  {
    id: '3',
    name: 'Charlie',
    major: 'Arts',
    bio: 'Sketching around campus 🎨',
    lat: 51.515,
    lng: -0.09,
    isOnline: false
  }
];
