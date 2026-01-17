export interface Course {
    code: string;
    name: string;
    university: 'UQ' | 'QUT' | 'Griffith';
}

export const COURSES: Course[] = [
    // UQ (Pattern: 4 letters + 4 numbers)
    { code: 'CSSE1001', name: 'Introduction to Software Engineering', university: 'UQ' },
    { code: 'CSSE2002', name: 'Programming in the Large', university: 'UQ' },
    { code: 'CSSE2310', name: 'Computer Systems Principles and Programming', university: 'UQ' },
    { code: 'INFS1200', name: 'Introduction to Information Systems', university: 'UQ' },
    { code: 'MATH1061', name: 'Discrete Mathematics', university: 'UQ' },
    { code: 'STAT1201', name: 'Analysis of Scientific Data', university: 'UQ' },
    { code: 'LAWS1111', name: 'Legal Method', university: 'UQ' },
    { code: 'LAWS1112', name: 'Law of Torts A', university: 'UQ' },
    { code: 'LAWS1113', name: 'Law of Contract A', university: 'UQ' },
    { code: 'PHYS1001', name: 'Mechanics and Thermal Physics', university: 'UQ' },
    { code: 'BIOL1020', name: 'Genes, Cells and Evolution', university: 'UQ' },
    { code: 'CHEM1100', name: 'Chemistry 1', university: 'UQ' },
    { code: 'PSYC1030', name: 'Introduction to Psychology: Developmental, Social & Clinical', university: 'UQ' },
    { code: 'ECON1010', name: 'Introductory Microeconomics', university: 'UQ' },
    { code: 'BISM1201', name: 'Transforming Business with Information Systems', university: 'UQ' },

    // QUT (Pattern: 3 letters + 3 numbers - e.g. IFB104)
    { code: 'IFB104', name: 'Building IT Systems', university: 'QUT' },
    { code: 'IFB105', name: 'Database Management', university: 'QUT' },
    { code: 'CAB201', name: 'Programming Principles', university: 'QUT' },
    { code: 'CAB202', name: 'Microprocessors and Digital Systems', university: 'QUT' },
    { code: 'CAB403', name: 'Systems Programming', university: 'QUT' },
    { code: 'BSB111', name: 'Business Law and Ethics', university: 'QUT' },
    { code: 'AYB200', name: 'Financial Accounting', university: 'QUT' },
    { code: 'MGB200', name: 'Leading Organisations', university: 'QUT' },
    { code: 'EFB222', name: 'Quantitative Methods for Economics and Finance', university: 'QUT' },
    { code: 'CCB106', name: 'Popular Culture', university: 'QUT' },
    { code: 'KxB101', name: 'Introduction to Design', university: 'QUT' },
    { code: 'LWB145', name: 'Legal Foundations A', university: 'QUT' },
    { code: 'LWB147', name: 'Torts A', university: 'QUT' },
    { code: 'NSB117', name: 'Nursing and the Health Care System', university: 'QUT' },
    { code: 'PYB100', name: 'Foundation Psychology', university: 'QUT' },

    // Griffith (Pattern: 4 numbers + 3 letters - e.g. 1001ICT)
    { code: '1001ICT', name: 'Programming 1', university: 'Griffith' },
    { code: '1005ICT', name: 'Programming 2', university: 'Griffith' },
    { code: '1701ICT', name: 'Creative Application Development', university: 'Griffith' },
    { code: '2501ICT', name: 'Data Structures and Algorithms', university: 'Griffith' },
    { code: '3801ICT', name: 'Software Engineering', university: 'Griffith' },
    { code: '1001CCJ', name: 'Introduction to Criminology and Criminal Justice', university: 'Griffith' },
    { code: '1013CCJ', name: 'Introduction to Criminology', university: 'Griffith' },
    { code: '1001GBS', name: 'Why Geography Matters', university: 'Griffith' },
    { code: '1101AFE', name: 'Accounting for Decision Making', university: 'Griffith' },
    { code: '1303AFE', name: 'Economics for Decision Making 1', university: 'Griffith' },
    { code: '1001QCA', name: 'Creative Practice 1', university: 'Griffith' },
    { code: '1205MED', name: 'Health and Disease 1', university: 'Griffith' },
    { code: '1016MED', name: 'Anatomy and Physiology Systems 1', university: 'Griffith' },
    { code: '1001PSY', name: 'Introductory Cognitive and Biological Psychology', university: 'Griffith' },
    { code: '1002PSY', name: 'Introductory Individual and Social Psychology', university: 'Griffith' },
];

export const DEGREES = [
    'Bachelor of Computer Science',
    'Bachelor of Engineering (Honours)',
    'Bachelor of Information Technology',
    'Bachelor of Business',
    'Bachelor of Commerce',
    'Bachelor of Laws (Honours)',
    'Bachelor of Arts',
    'Bachelor of Science',
    'Bachelor of Nursing',
    'Bachelor of Psychological Science',
    'Bachelor of Design',
    'Bachelor of Biomedical Science',
    'Master of Information Technology',
    'Master of Business Administration (MBA)',
];

export const INTERESTS = [
    'Coding', 'Design', 'Startups', 'Coffee', 'Gym', 'Running',
    'Photography', 'Music', 'Gaming', 'Reading', 'Travel', 'Hiking',
    'Surfing', 'Skating', 'Yoga', 'Meditation', 'Cooking', 'Art'
];
