export interface Course {
    code: string;
    name: string;
    university: 'UQ' | 'QUT' | 'Griffith';
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
    { code: 'CSSE7030', name: 'Introduction to Software Engineering (Postgrad)', university: 'UQ' },
    { code: 'INFS1200', name: 'Introduction to Information Systems', university: 'UQ' },
    { code: 'INFS2200', name: 'Relational Database Systems', university: 'UQ' },
    { code: 'INFS3200', name: 'Advanced Database Systems', university: 'UQ' },
    { code: 'INFS4203', name: 'Data Mining', university: 'UQ' },
    { code: 'COMP3506', name: 'Algorithms & Data Structures', university: 'UQ' },
    { code: 'COMP3702', name: 'Artificial Intelligence', university: 'UQ' },
    { code: 'COMP4702', name: 'Machine Learning', university: 'UQ' },

    // Engineering
    { code: 'ENGG1100', name: 'Professional Engineering', university: 'UQ' },
    { code: 'ENGG1200', name: 'Engineering Modelling & Problem Solving', university: 'UQ' },
    { code: 'ENGG1300', name: 'Introduction to Electrical Systems', university: 'UQ' },
    { code: 'ENGG1400', name: 'Engineering Mechanics: Statics & Dynamics', university: 'UQ' },
    { code: 'ENGG1500', name: 'Engineering Thermodynamics', university: 'UQ' },
    { code: 'ENGG1600', name: 'Introduction to Materials Science', university: 'UQ' },
    { code: 'METR4201', name: 'Control Engineering 1', university: 'UQ' },
    { code: 'METR4202', name: 'Robotics & Automation', university: 'UQ' },

    // Science & Maths
    { code: 'MATH1051', name: 'Calculus & Linear Algebra I', university: 'UQ' },
    { code: 'MATH1052', name: 'Multivariate Calculus & Ordinary Differential Equations', university: 'UQ' },
    { code: 'MATH1061', name: 'Discrete Mathematics', university: 'UQ' },
    { code: 'MATH1071', name: 'Advanced Calculus & Linear Algebra I', university: 'UQ' },
    { code: 'STAT1201', name: 'Analysis of Scientific Data', university: 'UQ' },
    { code: 'STAT1301', name: 'Advanced Analysis of Scientific Data', university: 'UQ' },
    { code: 'PHYS1001', name: 'Mechanics and Thermal Physics', university: 'UQ' },
    { code: 'PHYS1002', name: 'Electromagnetism and Modern Physics', university: 'UQ' },
    { code: 'BIOL1020', name: 'Genes, Cells and Evolution', university: 'UQ' },
    { code: 'BIOL1030', name: 'Global Challenges in Biology', university: 'UQ' },
    { code: 'CHEM1100', name: 'Chemistry 1', university: 'UQ' },
    { code: 'CHEM1200', name: 'Chemistry 2', university: 'UQ' },

    // Law & Business
    { code: 'LAWS1111', name: 'Legal Method', university: 'UQ' },
    { code: 'LAWS1112', name: 'Law of Torts A', university: 'UQ' },
    { code: 'LAWS1113', name: 'Law of Contract A', university: 'UQ' },
    { code: 'LAWS1114', name: 'Law of Torts B', university: 'UQ' },
    { code: 'LAWS1115', name: 'Law of Contract B', university: 'UQ' },
    { code: 'LAWS1116', name: 'Criminal Law and Procedure A', university: 'UQ' },
    { code: 'ACCT1101', name: 'Accounting for Decision Making', university: 'UQ' },
    { code: 'BISM1201', name: 'Transforming Business with Information Systems', university: 'UQ' },
    { code: 'ECON1010', name: 'Introductory Microeconomics', university: 'UQ' },
    { code: 'ECON1020', name: 'Introductory Macroeconomics', university: 'UQ' },
    { code: 'FINM1401', name: 'Personal Finance', university: 'UQ' },
    { code: 'MGTS1301', name: 'Introduction to Management', university: 'UQ' },
    { code: 'MKTG1501', name: 'Foundations of Marketing', university: 'UQ' },

    // Humanities & Social Sciences
    { code: 'PSYC1020', name: 'Introduction to Psychology: Physiological & Cognitive', university: 'UQ' },
    { code: 'PSYC1030', name: 'Introduction to Psychology: Developmental, Social & Clinical', university: 'UQ' },
    { code: 'PSYC1040', name: 'Psychological Research Methodology I', university: 'UQ' },
    { code: 'COMU1120', name: 'Media Legislation and Ethics', university: 'UQ' },
    { code: 'COMU1130', name: 'Journalism: Investigation and Research', university: 'UQ' },
    { code: 'POLS1201', name: 'Introduction to International Relations', university: 'UQ' },

    // --- QUT (Queensland University of Technology) ---
    // Business
    { code: 'BSB106', name: 'Dynamic Markets', university: 'QUT' },
    { code: 'BSB107', name: 'Financial Performance and Responsibility', university: 'QUT' },
    { code: 'BSB105', name: 'The Future of Business', university: 'QUT' },
    { code: 'BSB111', name: 'Business Law and Ethics', university: 'QUT' },
    { code: 'BSB113', name: 'Economics', university: 'QUT' },
    { code: 'BSB123', name: 'Data Analysis', university: 'QUT' },
    { code: 'BSB126', name: 'Marketing', university: 'QUT' },
    { code: 'AYB200', name: 'Financial Accounting', university: 'QUT' },
    { code: 'MGB200', name: 'Leading Organisations', university: 'QUT' },
    { code: 'EFB222', name: 'Quantitative Methods for Economics and Finance', university: 'QUT' },

    // Information Technology & Computer Science
    { code: 'IFB101', name: 'Impact of IT', university: 'QUT' },
    { code: 'IFB102', name: 'Introduction to Computer Systems', university: 'QUT' },
    { code: 'IFB103', name: 'IT Systems Design', university: 'QUT' },
    { code: 'IFB104', name: 'Building IT Systems', university: 'QUT' },
    { code: 'IFB240', name: 'IT Project Management', university: 'QUT' },
    { code: 'IFB299', name: 'Application Design and Development', university: 'QUT' },
    { code: 'CAB201', name: 'Programming Principles', university: 'QUT' },
    { code: 'CAB202', name: 'Microprocessors and Digital Systems', university: 'QUT' },
    { code: 'CAB203', name: 'Discrete Structures', university: 'QUT' },
    { code: 'CAB210', name: 'Software Architecture', university: 'QUT' },
    { code: 'CAB230', name: 'Web Computing', university: 'QUT' },
    { code: 'CAB301', name: 'Algorithms and Complexity', university: 'QUT' },
    { code: 'CAB302', name: 'Software Development', university: 'QUT' },
    { code: 'CAB403', name: 'Systems Programming', university: 'QUT' },
    { code: 'CAB420', name: 'Machine Learning', university: 'QUT' },
    { code: 'CAB432', name: 'Cloud Computing', university: 'QUT' },

    // Engineering & Science
    { code: 'EGB100', name: 'Engineering Sustainability and Professional Practice', university: 'QUT' },
    { code: 'EGB101', name: 'Engineering Design and Professional Practice', university: 'QUT' },
    { code: 'EGB102', name: 'Energy and Sciences', university: 'QUT' },
    { code: 'EGB103', name: 'Engineering Mechanics and Materials', university: 'QUT' },
    { code: 'EGB111', name: 'Foundations of Engineering Design', university: 'QUT' },
    { code: 'EGB113', name: 'Energy in Engineering Systems', university: 'QUT' },
    { code: 'EGB120', name: 'Foundations of Electrical Engineering', university: 'QUT' },
    { code: 'MZB125', name: 'Introductory Engineering Mathematics', university: 'QUT' },
    { code: 'MZB126', name: 'Engineering Mathematics', university: 'QUT' },

    // Law & Justice
    { code: 'LWB136', name: 'Contracts A', university: 'QUT' },
    { code: 'LWB137', name: 'Contracts B', university: 'QUT' },
    { code: 'LWB145', name: 'Legal Foundations A', university: 'QUT' },
    { code: 'LWB146', name: 'Legal Foundations B', university: 'QUT' },
    { code: 'LWB147', name: 'Torts A', university: 'QUT' },
    { code: 'LWB148', name: 'Torts B', university: 'QUT' },
    { code: 'LBB101', name: 'Introduction to Law', university: 'QUT' },

    // Health & Nursing
    { code: 'NSB102', name: 'Introduction to Clinical Practice', university: 'QUT' },
    { code: 'NSB113', name: 'Diversity and Health: Cultural Safety', university: 'QUT' },
    { code: 'NSB117', name: 'Nursing and the Health Care System', university: 'QUT' },
    { code: 'NSB204', name: 'Mental Health Nursing', university: 'QUT' },
    { code: 'PYB007', name: 'Interpersonal Processes and Skills', university: 'QUT' },
    { code: 'PYB100', name: 'Foundation Psychology', university: 'QUT' },
    { code: 'PYB102', name: 'Introduction to Psychology 1', university: 'QUT' },

    // Creative Industries
    { code: 'CCB101', name: 'Introduction to Media and Communication', university: 'QUT' },
    { code: 'CCB106', name: 'Popular Culture', university: 'QUT' },
    { code: 'KxB101', name: 'Introduction to Design', university: 'QUT' },
    { code: 'KxB102', name: 'Design Communication', university: 'QUT' },

    // --- Griffith University ---
    // ICT & Engineering
    { code: '1001ICT', name: 'Programming 1', university: 'Griffith' },
    { code: '1005ICT', name: 'Programming 2', university: 'Griffith' },
    { code: '1002ICT', name: 'Introduction to Computer Systems', university: 'Griffith' },
    { code: '1003ICT', name: 'Information Management', university: 'Griffith' },
    { code: '1004ICT', name: 'Introduction to Information Systems', university: 'Griffith' },
    { code: '1701ICT', name: 'Creative Application Development', university: 'Griffith' },
    { code: '1803ICT', name: 'Application Systems', university: 'Griffith' },
    { code: '2501ICT', name: 'Data Structures and Algorithms', university: 'Griffith' },
    { code: '3624ICT', name: '3D Game Development', university: 'Griffith' },
    { code: '3801ICT', name: 'Software Engineering', university: 'Griffith' },
    { code: '3805ICT', name: 'Advanced Algorithms', university: 'Griffith' },
    { code: '3806ICT', name: 'Robotics, Agents and Reasoning', university: 'Griffith' },
    { code: '3811ICT', name: 'Advanced Network Architectures', university: 'Griffith' },
    { code: '7502ICT', name: 'Fundamentals of Blockchain', university: 'Griffith' },
    { code: '7905ICT', name: 'Cyber Security Essentials', university: 'Griffith' },

    // Business & Commerce
    { code: '1001GBS', name: 'Why Geography Matters', university: 'Griffith' },
    { code: '1002GBS', name: 'Real World Economics', university: 'Griffith' },
    { code: '1003GBS', name: 'Managing Organisations', university: 'Griffith' },
    { code: '1101AFE', name: 'Accounting for Decision Making', university: 'Griffith' },
    { code: '1201AFE', name: 'Financial Institutions and Markets', university: 'Griffith' },
    { code: '1303AFE', name: 'Economics for Decision Making 1', university: 'Griffith' },
    { code: '1304AFE', name: 'Economics for Decision Making 2', university: 'Griffith' },

    // Criminology & Law
    { code: '1001CCJ', name: 'Introduction to Criminology and Criminal Justice', university: 'Griffith' },
    { code: '1013CCJ', name: 'Introduction to Criminology', university: 'Griffith' },
    { code: '2004CCJ', name: 'Police, Courts and Criminal Law', university: 'Griffith' },
    { code: '3024CCJ', name: 'Crime Prevention', university: 'Griffith' },
    { code: '1001LAW', name: 'Foundations of Law', university: 'Griffith' },
    { code: '1002LAW', name: 'Contracts 1', university: 'Griffith' },

    // Health & Psychology
    { code: '1001PSY', name: 'Introductory Cognitive and Biological Psychology', university: 'Griffith' },
    { code: '1002PSY', name: 'Introductory Individual and Social Psychology', university: 'Griffith' },
    { code: '1003PSY', name: 'Research Methods and Statistics in Psychology 1', university: 'Griffith' },
    { code: '1004PSY', name: 'Research Methods and Statistics in Psychology 2', university: 'Griffith' },
    { code: '1205MED', name: 'Health and Disease 1', university: 'Griffith' },
    { code: '1016MED', name: 'Anatomy and Physiology Systems 1', university: 'Griffith' },
    { code: '1001NRS', name: 'Foundations of Nursing Practice 1', university: 'Griffith' },
    { code: '1002NRS', name: 'Foundations of Nursing Practice 2', university: 'Griffith' },
    { code: '1001MSC', name: 'Introduction to Biomedical Science', university: 'Griffith' },

    // Arts & Creative
    { code: '1001QCA', name: 'Creative Practice 1', university: 'Griffith' },
    { code: '1002QCA', name: 'Creative Practice 2', university: 'Griffith' },
    { code: '1010HUM', name: 'Understanding the Social World', university: 'Griffith' },
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
