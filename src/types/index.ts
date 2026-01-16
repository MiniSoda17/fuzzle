export type ActivityType = 'study' | 'hoops' | 'coffee' | 'walk' | 'food';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  degree: string;
  university: 'UQ' | 'QUT' | 'Griffith';
  year: number;
  bio: string;
  subjects: string[];
  interests: string[];
  lat: number;
  lng: number;
  isOnline: boolean;
}

export const UNIVERSITIES = {
  UQ: { lat: -27.4975, lng: 153.0137 },
  QUT: { lat: -27.4772, lng: 153.0285 },
  Griffith: { lat: -27.5544, lng: 153.0505 }
};

const INTERESTS = ['Surfing', 'Coding', 'Photography', 'Reading', 'Gaming', 'Hiking', 'Music', 'Basketball', 'Art', 'Coffee'];
const SUBJECTS = ['CSSE1001', 'CRIM1000', 'MATH1051', 'PHYS1002', 'ARTS3001', 'PSYC2020', 'ENGG1100', 'MKTG2010'];
const DEGREES = ['Computer Science', 'Engineering', 'Psychology', 'Arts', 'Business', 'Law', 'Science', 'Medicine'];

// Helper to generate mock users
const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  const universities: ('UQ' | 'QUT' | 'Griffith')[] = ['UQ', 'QUT', 'Griffith'];
  const profileImages = [
    '/student_profile_1_1768606123923.png',
    '/student_profile_2_1768606138340.png',
    '/student_profile_3_1768606152373.png',
    '/student_profile_4_1768606170415.png'
  ];

  for (let i = 0; i < count; i++) {
    const uni = universities[Math.floor(Math.random() * universities.length)];
    const center = UNIVERSITIES[uni];

    // Random offset near university
    const lat = center.lat + (Math.random() - 0.5) * 0.01;
    const lng = center.lng + (Math.random() - 0.5) * 0.01;

    users.push({
      id: `user-${i}`,
      name: `Student ${i + 1}`, // In real app, real names
      avatarUrl: profileImages[i % profileImages.length],
      university: uni,
      degree: DEGREES[Math.floor(Math.random() * DEGREES.length)],
      year: Math.floor(Math.random() * 4) + 1,
      bio: 'Just looking for study buddies or good coffee spots!',
      subjects: Array.from({ length: 3 }, () => SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]),
      interests: Array.from({ length: 4 }, () => INTERESTS[Math.floor(Math.random() * INTERESTS.length)]),
      lat,
      lng,
      isOnline: Math.random() > 0.3
    });
  }
  return users;
};

export const MOCK_USERS = generateUsers(20);

// Fix names for variety manually for the first few to be realistic
MOCK_USERS[0].name = "Sarah Jenkins";
MOCK_USERS[1].name = "David Chen";
MOCK_USERS[2].name = "Emily Wilson";
MOCK_USERS[3].name = "Marcus Johnson";
MOCK_USERS[4].name = "Jessica Lee";
MOCK_USERS[5].name = "Tom Baker";
MOCK_USERS[6].name = "Rachel Green";
MOCK_USERS[7].name = "Michael Scott";
