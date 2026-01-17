export interface University {
    id: 'UQ' | 'QUT' | 'Griffith' | 'USYD' | 'UNSW' | 'UniMelb' | 'Monash' | 'UTS';
    name: string;
    color: string;
    logo: string;
    location: { lat: number; lng: number };
}

export const UNIVERSITIES: University[] = [
    { id: 'UQ', name: 'University of Queensland', color: '#51247A', logo: '/logos/uq.svg', location: { lat: -27.4975, lng: 153.0137 } },
    { id: 'QUT', name: 'Queensland University of Technology', color: '#003E7E', logo: '/logos/qut.svg', location: { lat: -27.4772, lng: 153.0285 } },
    { id: 'Griffith', name: 'Griffith University', color: '#CC0000', logo: '/logos/griffith.svg', location: { lat: -27.5544, lng: 153.0505 } },
    { id: 'USYD', name: 'University of Sydney', color: '#E64626', logo: '/logos/usyd.svg', location: { lat: -33.8886, lng: 151.1873 } },
    { id: 'UNSW', name: 'UNSW Sydney', color: '#FFDD00', logo: '/logos/unsw.svg', location: { lat: -33.9173, lng: 151.2313 } },
    { id: 'UniMelb', name: 'University of Melbourne', color: '#094183', logo: '/logos/unimelb.svg', location: { lat: -37.7964, lng: 144.9612 } },
    { id: 'Monash', name: 'Monash University', color: '#006DAE', logo: '/logos/monash.svg', location: { lat: -37.9105, lng: 145.1362 } },
    { id: 'UTS', name: 'University of Technology Sydney', color: '#000000', logo: '/logos/uts.svg', location: { lat: -33.8832, lng: 151.2007 } },
];

export interface Course {
    code: string;
    name: string;
    university: University['id'];
}

export const COURSES: Course[] = [
    // --- UQ (University of Queensland) ---
    // Computer Science & IT
    { code: 'CSSE1001', name: 'Introduction to Software Engineering', university: 'UQ' },
    { code: 'CSSE2002', name: 'Programming in the Large', university: 'UQ' },
    { code: 'CSSE2010', name: 'Introduction to Computer Systems', university: 'UQ' },
    { code: 'CSSE2310', name: 'Computer Systems Principles and Programming', university: 'UQ' },
    { code: 'CSSE3010', name: 'Embedded Systems Design & Interfacing', university: 'UQ' },
    { code: 'CSSE3100', name: 'Reasoning About Programs', university: 'UQ' },
    { code: 'CSSE4004', name: 'Distributed Computing', university: 'UQ' },
    { code: 'INFS1200', name: 'Introduction to Information Systems', university: 'UQ' },
    { code: 'COMP3506', name: 'Algorithms & Data Structures', university: 'UQ' },
    { code: 'COMP3702', name: 'Artificial Intelligence', university: 'UQ' },

    // --- QUT (Queensland University of Technology) ---
    { code: 'CAB201', name: 'Programming Principles', university: 'QUT' },
    { code: 'CAB202', name: 'Microprocessors and Digital Systems', university: 'QUT' },
    { code: 'CAB301', name: 'Algorithms and Complexity', university: 'QUT' },
    { code: 'CAB403', name: 'Systems Programming', university: 'QUT' },
    { code: 'CAB432', name: 'Cloud Computing', university: 'QUT' },
    { code: 'IFB104', name: 'Building IT Systems', university: 'QUT' },

    // --- Griffith University ---
    { code: '1001ICT', name: 'Programming 1', university: 'Griffith' },
    { code: '1005ICT', name: 'Programming 2', university: 'Griffith' },
    { code: '2501ICT', name: 'Data Structures and Algorithms', university: 'Griffith' },
    { code: '3801ICT', name: 'Software Engineering', university: 'Griffith' },

    // --- USYD (University of Sydney) ---
    { code: 'INFO1110', name: 'Introduction to Programming', university: 'USYD' },
    { code: 'INFO1111', name: 'Computing 1A Professionalism', university: 'USYD' },
    { code: 'INFO1112', name: 'Operating Systems and Systems Programming', university: 'USYD' },
    { code: 'INFO1113', name: 'Object-Oriented Programming', university: 'USYD' },
    { code: 'COMP2123', name: 'Data Structures and Algorithms', university: 'USYD' },
    { code: 'COMP2017', name: 'Systems Programming', university: 'USYD' },
    { code: 'COMP3027', name: 'Algorithm Design', university: 'USYD' },
    { code: 'COMP3308', name: 'Introduction to Artificial Intelligence', university: 'USYD' },
    { code: 'SOFT2412', name: 'Agile Software Development Practices', university: 'USYD' },
    { code: 'ELEC1601', name: 'Introduction to Computer Systems', university: 'USYD' },

    // --- UNSW (University of New South Wales) ---
    { code: 'COMP1511', name: 'Programming Fundamentals', university: 'UNSW' },
    { code: 'COMP1521', name: 'Computer Systems Fundamentals', university: 'UNSW' },
    { code: 'COMP1531', name: 'Software Engineering Fundamentals', university: 'UNSW' },
    { code: 'COMP2521', name: 'Data Structures and Algorithms', university: 'UNSW' },
    { code: 'COMP2511', name: 'Object-Oriented Design & Programming', university: 'UNSW' },
    { code: 'COMP3121', name: 'Algorithms and Programming Techniques', university: 'UNSW' },
    { code: 'COMP3311', name: 'Database Systems', university: 'UNSW' },
    { code: 'COMP3331', name: 'Computer Networks and Applications', university: 'UNSW' },
    { code: 'COMP6080', name: 'Web Front-End Programming', university: 'UNSW' },
    { code: 'COMP9414', name: 'Artificial Intelligence', university: 'UNSW' },

    // --- UniMelb (University of Melbourne) ---
    { code: 'COMP10001', name: 'Foundations of Computing', university: 'UniMelb' },
    { code: 'COMP10002', name: 'Foundations of Algorithms', university: 'UniMelb' },
    { code: 'COMP20005', name: 'Engineering Computation', university: 'UniMelb' },
    { code: 'COMP20007', name: 'Design of Algorithms', university: 'UniMelb' },
    { code: 'COMP30022', name: 'IT Project', university: 'UniMelb' },
    { code: 'COMP30023', name: 'Computer Systems', university: 'UniMelb' },
    { code: 'COMP30026', name: 'Models of Computation', university: 'UniMelb' },
    { code: 'SWEN30006', name: 'Software Modelling and Design', university: 'UniMelb' },
    { code: 'INFO20003', name: 'Database Systems', university: 'UniMelb' },
    { code: 'INFO30005', name: 'Web Information Technologies', university: 'UniMelb' },

    // --- Monash University ---
    { code: 'FIT1008', name: 'Introduction to Computer Science', university: 'Monash' },
    { code: 'FIT1045', name: 'Algorithms and Programming Fundamentals', university: 'Monash' },
    { code: 'FIT1051', name: 'Programming Fundamentals in Java', university: 'Monash' },
    { code: 'FIT2004', name: 'Algorithms and Data Structures', university: 'Monash' },
    { code: 'FIT2014', name: 'Theory of Computation', university: 'Monash' },
    { code: 'FIT2102', name: 'Programming Paradigms', university: 'Monash' },
    { code: 'FIT3155', name: 'Advanced Data Structures and Algorithms', university: 'Monash' },
    { code: 'FIT3171', name: 'Databases', university: 'Monash' },
    { code: 'ENG1003', name: 'Engineering Mobile Apps', university: 'Monash' },
    { code: 'MAT1830', name: 'Discrete Mathematics for Computer Science', university: 'Monash' },

    // --- UTS (University of Technology Sydney) ---
    { code: '48023', name: 'Programming Fundamentals', university: 'UTS' },
    { code: '31268', name: 'Web Systems', university: 'UTS' },
    { code: '31269', name: 'Business Requirements Modelling', university: 'UTS' },
    { code: '41092', name: 'Network Fundamentals', university: 'UTS' },
    { code: '31251', name: 'Data Structures and Algorithms', university: 'UTS' },
    { code: '31257', name: 'Information System Development Methodologies', university: 'UTS' },
    { code: '48024', name: 'Applications Programming', university: 'UTS' },
    { code: '41029', name: 'Engineering Research Preparation', university: 'UTS' },
    { code: '31271', name: 'Database Fundamentals', university: 'UTS' },
];

export const DEGREES = [
    // Technology
    'Bachelor of Computer Science',
    'Bachelor of Information Technology',
    'Bachelor of Software Engineering (Honours)',
    'Bachelor of Games Design',
    'Master of Information Technology',
    'Master of Cyber Security',
    'Master of Computer Science',
    'Master of Data Science',

    // Engineering & Science
    'Bachelor of Engineering (Honours)',
    'Bachelor of Science',
    'Bachelor of Biomedical Science',
    'Bachelor of Environmental Science',
    'Bachelor of Advanced Science (Honours)',
    'Master of Engineering Science',

    // Business & Law
    'Bachelor of Business',
    'Bachelor of Commerce',
    'Bachelor of Laws (Honours)',
    'Bachelor of International Business',
    'Bachelor of Economics',
    'Master of Business Administration (MBA)',
    'Master of Business',
    'Master of Commerce',

    // Health
    'Bachelor of Nursing',
    'Bachelor of Psychological Science',
    'Bachelor of Pharmacy (Honours)',
    'Bachelor of Health Science',
    'Bachelor of Dental Health Science',
    'Bachelor of Medical Science',
    'Doctor of Medicine (MD)',

    // Arts & Education
    'Bachelor of Arts',
    'Bachelor of Communication',
    'Bachelor of Design',
    'Bachelor of Education (Primary)',
    'Bachelor of Education (Secondary)',
    'Bachelor of Journalism',
    'Bachelor of Music',
    'Master of Architecture',
];

export const INTERESTS = [
    'Coding', 'Design', 'Startups', 'Coffee', 'Gym', 'Running',
    'Photography', 'Music', 'Gaming', 'Reading', 'Travel', 'Hiking',
    'Surfing', 'Skating', 'Yoga', 'Meditation', 'Cooking', 'Art',
    'Blockchain', 'AI', 'Robotics', 'Volunteering', 'Language Learning',
    'Film', 'Theatre', 'Dance', 'Investing', 'Crypto', 'Politics',
    'History', 'Philosophy', 'Psychology', 'Astronomy', 'Sustainability',
    'Fashion', 'Anime', 'Board Games', 'Debating', 'Networking', 'Hackathons'
];
