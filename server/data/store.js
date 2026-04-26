const bcrypt = require('bcryptjs');

const hash = (pwd) => bcrypt.hashSync(pwd, 10);

const users = [
  {
    id: 'u1', name: 'Prof. Basit Adewale', email: 'admin@lasustech.edu.ng',
    password: hash('123456'), role: 'admin', department: 'ICT',
    avatar: null, status: 'active', joinedAt: '2023-09-01T08:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'u2', name: 'Prof. Abdul-basit', email: 'prof.basit@lasustech.edu.ng',
    password: hash('123456'), role: 'lecturer', department: 'Computer Science',
    avatar: null, status: 'active', joinedAt: '2023-09-01T08:00:00Z',
    bio: 'Professor of Computer Science, Specialises in Software Engineering and AI Systems',
    courses: ['c1', 'c3', 'c5', 'c6', 'c7'], lastLogin: new Date().toISOString()
  },
  {
    id: 'u3', name: 'Prof. Abdul-basit', email: 'dr.aisha@lasustech.edu.ng',
    password: hash('141414'), role: 'lecturer', department: 'Mathematics',
    avatar: null, status: 'active', joinedAt: '2023-09-01T08:00:00Z',
    bio: 'Professor of Applied Mathematics, 15+ years of teaching experience',
    courses: ['c2', 'c4', 'c8', 'c9', 'c10'], lastLogin: new Date().toISOString()
  },
  {
    id: 'u4', name: 'John Oladele', email: 'john.ola@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Computer Science',
    avatar: null, status: 'active', level: '300', matric: 'LASU/CSC/300/001',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u5', name: 'Sarah Adamu', email: 'sarah.adamu@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Computer Science',
    avatar: null, status: 'active', level: '200', matric: 'LASU/CSC/200/042',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u6', name: 'Michael Eze', email: 'michael.eze@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Electrical Engineering',
    avatar: null, status: 'active', level: '300', matric: 'LASU/EEE/300/018',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u7', name: 'Fatima Yusuf', email: 'fatima.yusuf@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Mathematics',
    avatar: null, status: 'active', level: '200', matric: 'LASU/MTH/200/009',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u8', name: 'Chukwuemeka Obi', email: 'emeka.obi@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Computer Science',
    avatar: null, status: 'active', level: '400', matric: 'LASU/CSC/400/033',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u9', name: 'Amina Ibrahim', email: 'amina.ibrahim@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Biochemistry',
    avatar: null, status: 'active', level: '300', matric: 'LASU/BCH/300/007',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u10', name: 'Tunde Fashola', email: 'tunde.fashola@student.lasustech.edu.ng',
    password: hash('141414'), role: 'student', department: 'Civil Engineering',
    avatar: null, status: 'active', level: '400', matric: 'LASU/CVE/400/021',
    joinedAt: '2023-09-15T08:00:00Z', lastLogin: new Date().toISOString()
  }
];

const courses = [
  {
    id: 'c1', code: 'CSC 301', title: 'Data Structures and Algorithms',
    description: 'A comprehensive study of fundamental data structures including arrays, linked lists, stacks, queues, trees, graphs, and hash tables, alongside algorithmic design paradigms such as divide-and-conquer, dynamic programming, and greedy algorithms.',
    lecturerId: 'u2', credits: 3, level: '300', semester: '2nd Semester 2025/2026',
    department: 'Computer Science', maxStudents: 60, status: 'active',
    thumbnail: null,
    objectives: ['Understand core data structures', 'Analyse algorithm complexity', 'Implement efficient algorithms', 'Apply algorithmic thinking'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c2', code: 'MTH 201', title: 'Calculus and Linear Algebra',
    description: 'Covers differential and integral calculus including limits, derivatives, integrals, and their applications. Linear algebra topics include matrices, determinants, vector spaces, eigenvalues, and eigenvectors.',
    lecturerId: 'u3', credits: 3, level: '200', semester: '2nd Semester 2025/2026',
    department: 'Mathematics', maxStudents: 80, status: 'active',
    thumbnail: null,
    objectives: ['Master differential calculus', 'Apply integral techniques', 'Understand linear transformations', 'Solve systems of equations'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c3', code: 'CSC 201', title: 'Object-Oriented Programming',
    description: 'Introduction to object-oriented programming concepts using Java. Topics include classes, objects, inheritance, polymorphism, encapsulation, abstraction, interfaces, exception handling, and collections framework.',
    lecturerId: 'u2', credits: 3, level: '200', semester: '2nd Semester 2025/2026',
    department: 'Computer Science', maxStudents: 70, status: 'active',
    thumbnail: null,
    objectives: ['Understand OOP principles', 'Write Java applications', 'Design class hierarchies', 'Handle exceptions properly'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c4', code: 'PHY 211', title: 'Physics for Engineers',
    description: 'Applied physics for engineering students covering mechanics, thermodynamics, electromagnetism, waves and optics. Emphasis on mathematical modelling and problem-solving in engineering contexts.',
    lecturerId: 'u3', credits: 2, level: '200', semester: '2nd Semester 2025/2026',
    department: 'Physics', maxStudents: 90, status: 'active',
    thumbnail: null,
    objectives: ["Apply Newton's laws", 'Understand thermodynamic principles', 'Analyse electromagnetic phenomena', 'Solve engineering physics problems'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c5', code: 'CSC 401', title: 'Computer Networks',
    description: 'Comprehensive study of computer networking principles including OSI model, TCP/IP protocols, routing algorithms, network security, and wireless networks. Lab sessions include hands-on network configuration.',
    lecturerId: 'u2', credits: 3, level: '400', semester: '2nd Semester 2025/2026',
    department: 'Computer Science', maxStudents: 50, status: 'active',
    thumbnail: null,
    objectives: ['Understand network protocols', 'Configure network devices', 'Implement security measures', 'Design network topologies'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c6', code: 'CSC 302', title: 'Database Management Systems',
    description: 'Principles and practice of database systems including relational model, SQL, normalisation, transaction management, indexing, and query optimisation. Hands-on experience with real database engines.',
    lecturerId: 'u2', credits: 3, level: '300', semester: '2nd Semester 2025/2026',
    department: 'Computer Science', maxStudents: 65, status: 'active',
    thumbnail: null,
    objectives: ['Design relational databases', 'Write complex SQL queries', 'Apply normalisation principles', 'Manage transactions safely'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c7', code: 'CSC 403', title: 'Software Engineering',
    description: 'A thorough treatment of software development methodologies including Agile, Scrum, requirements engineering, system design, testing strategies, project management, and maintenance practices.',
    lecturerId: 'u2', credits: 3, level: '400', semester: '2nd Semester 2025/2026',
    department: 'Computer Science', maxStudents: 55, status: 'active',
    thumbnail: null,
    objectives: ['Apply software development lifecycles', 'Write software requirements', 'Design system architecture', 'Plan and execute tests'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c8', code: 'MTH 301', title: 'Probability and Statistics',
    description: 'Probability theory, random variables, distributions, statistical inference, hypothesis testing, regression analysis, and their applications in science and engineering.',
    lecturerId: 'u3', credits: 3, level: '300', semester: '2nd Semester 2025/2026',
    department: 'Mathematics', maxStudents: 75, status: 'active',
    thumbnail: null,
    objectives: ['Apply probability laws', 'Analyse statistical data', 'Perform hypothesis tests', 'Interpret regression output'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c9', code: 'EEE 302', title: 'Electronics and Circuit Theory',
    description: 'Covers semiconductor devices, operational amplifiers, digital circuits, signal analysis, and filter design with laboratory sessions on practical circuit implementation and measurement.',
    lecturerId: 'u3', credits: 3, level: '300', semester: '2nd Semester 2025/2026',
    department: 'Electrical Engineering', maxStudents: 60, status: 'active',
    thumbnail: null,
    objectives: ['Analyse AC and DC circuits', 'Design amplifier stages', 'Understand digital logic', 'Use laboratory instruments'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'c10', code: 'BCH 301', title: 'Biochemistry and Molecular Biology',
    description: 'Fundamental concepts of biochemistry including enzyme kinetics, metabolic pathways, molecular genetics, protein structure, and cell signalling. Laboratory practicals reinforce theoretical content.',
    lecturerId: 'u3', credits: 3, level: '300', semester: '2nd Semester 2025/2026',
    department: 'Biochemistry', maxStudents: 70, status: 'active',
    thumbnail: null,
    objectives: ['Understand metabolic pathways', 'Apply enzyme kinetics', 'Interpret molecular biology data', 'Conduct biochemical assays'],
    createdAt: '2023-09-10T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z'
  }
];

const lessons = [
  { id: 'l1', courseId: 'c1', order: 1, title: 'Introduction to Data Structures', type: 'text', duration: 45, videoUrl: null, materials: [{ name: 'Week1_Slides.pdf', url: '#', size: '2.4MB' }], createdAt: '2023-09-12T08:00:00Z', content: '# Introduction to Data Structures\n\nA data structure is a way of organising and storing data in a computer so that it can be accessed and modified efficiently.' },
  { id: 'l2', courseId: 'c1', order: 2, title: 'Arrays and Linked Lists', type: 'text', duration: 60, videoUrl: 'https://www.youtube.com/embed/RBSGKlAvoiM', materials: [{ name: 'Week2_Arrays_LinkedLists.pdf', url: '#', size: '3.1MB' }], createdAt: '2023-09-19T08:00:00Z', content: '# Arrays and Linked Lists\n\nArrays and linked lists are the foundational sequential data structures used in every computing system.' },
  { id: 'l3', courseId: 'c1', order: 3, title: 'Stacks and Queues', type: 'text', duration: 50, videoUrl: null, materials: [{ name: 'Week3_Stacks_Queues.pdf', url: '#', size: '2.8MB' }], createdAt: '2023-09-26T08:00:00Z', content: '# Stacks and Queues\n\nStacks follow LIFO and queues follow FIFO — the two fundamental orderings for sequential data processing.' },
  { id: 'l4', courseId: 'c1', order: 4, title: 'Trees and Binary Search Trees', type: 'text', duration: 70, videoUrl: 'https://www.youtube.com/embed/oSWTXtMglKE', materials: [{ name: 'Week4_Trees.pdf', url: '#', size: '4.2MB' }], createdAt: '2023-10-03T08:00:00Z', content: '# Trees and Binary Search Trees\n\nTrees are hierarchical data structures. A BST orders nodes so that left < root < right, enabling O(log n) search.' },
  { id: 'l5', courseId: 'c2', order: 1, title: 'Limits and Continuity', type: 'text', duration: 55, videoUrl: null, materials: [{ name: 'MTH201_Week1.pdf', url: '#', size: '1.9MB' }], createdAt: '2023-09-12T08:00:00Z', content: '# Limits and Continuity\n\nThe concept of a limit is the foundation of calculus. lim(x→a) f(x) = L means f(x) approaches L as x approaches a.' },
  { id: 'l6', courseId: 'c2', order: 2, title: 'Differentiation', type: 'text', duration: 60, videoUrl: 'https://www.youtube.com/embed/rAof9Ld5sOg', materials: [{ name: 'MTH201_Week2_Derivatives.pdf', url: '#', size: '2.5MB' }], createdAt: '2023-09-19T08:00:00Z', content: '# Differentiation\n\nThe derivative f\'(x) measures the instantaneous rate of change of a function at a point.' },
  { id: 'l7', courseId: 'c3', order: 1, title: 'Introduction to OOP Concepts', type: 'text', duration: 50, videoUrl: null, materials: [{ name: 'CSC201_Week1_OOP.pdf', url: '#', size: '3.0MB' }], createdAt: '2023-09-12T08:00:00Z', content: '# Introduction to Object-Oriented Programming\n\nOOP organises software around objects combining data and behaviour through encapsulation, inheritance, polymorphism, and abstraction.' },
  { id: 'l8', courseId: 'c4', order: 1, title: "Mechanics and Newton's Laws", type: 'text', duration: 55, videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds', materials: [{ name: 'PHY211_Week1_Mechanics.pdf', url: '#', size: '2.2MB' }], createdAt: '2023-09-12T08:00:00Z', content: "# Mechanics and Newton's Laws of Motion\n\nNewton's three laws govern classical mechanics: inertia, F=ma, and action-reaction." },
  { id: 'l9', courseId: 'c5', order: 1, title: 'Network Fundamentals and OSI Model', type: 'text', duration: 60, videoUrl: null, materials: [{ name: 'CSC401_Week1_Networks.pdf', url: '#', size: '3.5MB' }], createdAt: '2023-09-12T08:00:00Z', content: '# Network Fundamentals and the OSI Model\n\nThe OSI model describes seven layers of network communication from Physical (Layer 1) to Application (Layer 7).' }
];

const enrollments = [
  { id: 'e1', studentId: 'u4', courseId: 'c1', enrolledAt: '2023-09-15T08:00:00Z', progress: 75 },
  { id: 'e2', studentId: 'u4', courseId: 'c3', enrolledAt: '2023-09-15T08:00:00Z', progress: 60 },
  { id: 'e3', studentId: 'u4', courseId: 'c5', enrolledAt: '2023-09-15T08:00:00Z', progress: 40 },
  { id: 'e4', studentId: 'u5', courseId: 'c2', enrolledAt: '2023-09-15T08:00:00Z', progress: 80 },
  { id: 'e5', studentId: 'u5', courseId: 'c3', enrolledAt: '2023-09-15T08:00:00Z', progress: 55 },
  { id: 'e6', studentId: 'u5', courseId: 'c4', enrolledAt: '2023-09-15T08:00:00Z', progress: 90 },
  { id: 'e7', studentId: 'u6', courseId: 'c1', enrolledAt: '2023-09-15T08:00:00Z', progress: 30 },
  { id: 'e8', studentId: 'u6', courseId: 'c4', enrolledAt: '2023-09-15T08:00:00Z', progress: 65 },
  { id: 'e9', studentId: 'u7', courseId: 'c2', enrolledAt: '2023-09-15T08:00:00Z', progress: 50 },
  { id: 'e10', studentId: 'u7', courseId: 'c4', enrolledAt: '2023-09-15T08:00:00Z', progress: 70 },
  { id: 'e11', studentId: 'u8', courseId: 'c1', enrolledAt: '2023-09-15T08:00:00Z', progress: 20 },
  { id: 'e12', studentId: 'u8', courseId: 'c5', enrolledAt: '2023-09-15T08:00:00Z', progress: 10 },
  { id: 'e13', studentId: 'u9', courseId: 'c10', enrolledAt: '2023-09-15T08:00:00Z', progress: 45 },
  { id: 'e14', studentId: 'u9', courseId: 'c2', enrolledAt: '2023-09-15T08:00:00Z', progress: 60 },
  { id: 'e15', studentId: 'u10', courseId: 'c5', enrolledAt: '2023-09-15T08:00:00Z', progress: 85 },
  { id: 'e16', studentId: 'u10', courseId: 'c6', enrolledAt: '2023-09-15T08:00:00Z', progress: 55 }
];

const assignments = [
  {
    id: 'a1', courseId: 'c1', title: 'Implement a Binary Search Tree',
    description: 'Implement a complete BST class in Java with insert, delete, search, and all traversals. Include time complexity analysis.',
    dueDate: '2026-05-15T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-15T08:00:00Z'
  },
  {
    id: 'a2', courseId: 'c1', title: 'Algorithm Analysis and Sorting',
    description: 'Implement Bubble, Selection, Insertion, Merge and Quick Sort. Compare execution times across different input sizes and produce an analysis report.',
    dueDate: '2026-05-30T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-22T08:00:00Z'
  },
  {
    id: 'a3', courseId: 'c2', title: 'Calculus Problem Set 1',
    description: 'Solve problems on limits, derivatives, and applications of differentiation. Show all working.',
    dueDate: '2026-05-10T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-15T08:00:00Z'
  },
  {
    id: 'a4', courseId: 'c3', title: 'OOP Design — Library Management System',
    description: 'Design and implement a Library Management System applying all four OOP pillars. Use Java Collections and handle exceptions.',
    dueDate: '2026-05-20T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-20T08:00:00Z'
  },
  {
    id: 'a5', courseId: 'c5', title: 'Network Protocol Analysis with Wireshark',
    description: 'Capture and analyse HTTP and DNS traffic. Document the TCP handshake and identify OSI layers. Submit a 5-10 page PDF report.',
    dueDate: '2026-05-28T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-18T08:00:00Z'
  },
  {
    id: 'a6', courseId: 'c6', title: 'Database Design Project',
    description: 'Design a normalised relational database for a hospital management system. Provide ER diagram, schema, and SQL queries.',
    dueDate: '2026-05-18T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-16T08:00:00Z'
  },
  {
    id: 'a7', courseId: 'c7', title: 'Software Requirements Specification',
    description: 'Write a complete SRS document for a mobile banking application following IEEE 830 standards.',
    dueDate: '2026-05-22T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-20T08:00:00Z'
  },
  {
    id: 'a8', courseId: 'c8', title: 'Statistical Analysis Report',
    description: 'Analyse the provided dataset using descriptive statistics, hypothesis testing, and regression. Present findings with charts.',
    dueDate: '2026-05-12T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-15T08:00:00Z'
  },
  {
    id: 'a9', courseId: 'c9', title: 'Circuit Design and Simulation',
    description: 'Design and simulate a common-emitter amplifier circuit. Calculate gain, input/output impedance, and verify with simulation.',
    dueDate: '2026-05-25T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-21T08:00:00Z'
  },
  {
    id: 'a10', courseId: 'c10', title: 'Enzyme Kinetics Lab Report',
    description: 'Write a formal lab report on the enzyme kinetics experiment. Include Michaelis-Menten analysis and Lineweaver-Burk plot.',
    dueDate: '2026-05-16T23:59:00Z', totalMarks: 100, status: 'active',
    createdAt: '2026-04-17T08:00:00Z'
  }
];

const submissions = [
  {
    id: 's1', assignmentId: 'a1', studentId: 'u4',
    content: 'BST implemented with all required operations using recursive approach. All test cases pass.',
    submittedAt: '2026-05-14T20:30:00Z', grade: 88, feedback: 'Good implementation. Recursive approach is correct. Complexity analysis could be more detailed.',
    gradedAt: '2026-05-16T10:00:00Z', gradedBy: 'u2', status: 'graded'
  },
  {
    id: 's2', assignmentId: 'a3', studentId: 'u5',
    content: 'All calculus problems solved with full working shown.',
    submittedAt: '2026-05-09T18:45:00Z', grade: 92, feedback: 'Excellent work. All solutions correct. Chain rule and product rule applications are particularly strong.',
    gradedAt: '2026-05-12T09:00:00Z', gradedBy: 'u3', status: 'graded'
  },
  {
    id: 's3', assignmentId: 'a1', studentId: 'u6',
    content: 'BST implemented with iterative approach to avoid stack overflow. All test cases pass.',
    submittedAt: '2026-05-15T22:10:00Z', grade: null, feedback: null,
    gradedAt: null, gradedBy: null, status: 'pending'
  },
  {
    id: 's4', assignmentId: 'a4', studentId: 'u5',
    content: 'Library Management System with all required classes, interfaces, and exception handling.',
    submittedAt: '2026-05-19T16:00:00Z', grade: 95, feedback: 'Outstanding. Clean design applying all four OOP pillars.',
    gradedAt: '2026-05-22T11:00:00Z', gradedBy: 'u2', status: 'graded'
  }
];

const discussions = [
  {
    id: 'd1', courseId: 'c1', title: 'Help needed: BST delete operation',
    content: 'I am having trouble implementing the delete operation in BST, specifically when the node has two children. Can someone explain the step-by-step logic?',
    authorId: 'u4', pinned: false, views: 42,
    createdAt: '2026-04-20T14:30:00Z', updatedAt: '2026-04-21T09:00:00Z'
  },
  {
    id: 'd2', courseId: 'c1', title: 'Time Complexity Clarification — Assignment 2',
    content: 'For assignment 2, should we consider Quick Sort average case O(n log n) or worst case O(n²)? The assignment says to compare with theoretical complexity.',
    authorId: 'u6', pinned: false, views: 28,
    createdAt: '2026-04-25T11:00:00Z', updatedAt: '2026-04-25T15:30:00Z'
  },
  {
    id: 'd3', courseId: 'c1', title: '📢 Welcome to CSC 301 — Data Structures Forum',
    content: 'Welcome to the CSC 301 discussion forum. This is your space to ask questions, share insights, and help peers. I will monitor and respond within 24 hours.',
    authorId: 'u2', pinned: true, views: 156,
    createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-10T08:00:00Z'
  },
  {
    id: 'd4', courseId: 'c2', title: 'Chain Rule Application Examples',
    content: 'Can someone share additional examples of chain rule with trig and exponential functions combined? I understood the lecture but need more practice.',
    authorId: 'u5', pinned: false, views: 35,
    createdAt: '2026-04-22T16:00:00Z', updatedAt: '2026-04-23T10:00:00Z'
  },
  {
    id: 'd5', courseId: 'c3', title: '📢 OOP Project Guidelines',
    content: 'For the Library Management System: use at least 5 classes, interfaces are mandatory, exception handling must cover 3 scenarios, Javadoc required. Deadline: May 20.',
    authorId: 'u2', pinned: true, views: 89,
    createdAt: '2026-04-20T09:00:00Z', updatedAt: '2026-04-20T09:00:00Z'
  },
  {
    id: 'd6', courseId: 'c5', title: 'Wireshark Installation Issues on Windows 11',
    content: 'Has anyone had issues installing Wireshark on Windows 11? I keep getting a Npcap error. Any solutions?',
    authorId: 'u8', pinned: false, views: 19,
    createdAt: '2026-04-23T10:00:00Z', updatedAt: '2026-04-23T10:00:00Z'
  },
  {
    id: 'd7', courseId: 'c6', title: '📢 Database Project ER Diagram Requirements',
    content: 'Your ER diagram must show all entities, attributes, primary keys, foreign keys, and relationship cardinalities. Use Crow\'s Foot notation.',
    authorId: 'u2', pinned: true, views: 67,
    createdAt: '2026-04-16T09:00:00Z', updatedAt: '2026-04-16T09:00:00Z'
  },
  {
    id: 'd8', courseId: 'c7', title: 'Agile vs Waterfall for Banking Apps',
    content: 'For the SRS assignment, which methodology should we recommend — Agile or Waterfall? The banking sector is heavily regulated.',
    authorId: 'u10', pinned: false, views: 23,
    createdAt: '2026-04-24T14:00:00Z', updatedAt: '2026-04-24T14:00:00Z'
  },
  {
    id: 'd9', courseId: 'c8', title: 'Understanding p-values in Hypothesis Testing',
    content: 'I am confused about interpreting p-values. If p = 0.03 and α = 0.05, do we reject or fail to reject H₀?',
    authorId: 'u7', pinned: false, views: 31,
    createdAt: '2026-04-21T12:00:00Z', updatedAt: '2026-04-21T12:00:00Z'
  },
  {
    id: 'd10', courseId: 'c10', title: 'Lineweaver-Burk Plot Interpretation',
    content: 'Can anyone explain how to read off Km and Vmax from the Lineweaver-Burk double reciprocal plot? The axes are confusing me.',
    authorId: 'u9', pinned: false, views: 14,
    createdAt: '2026-04-23T16:30:00Z', updatedAt: '2026-04-23T16:30:00Z'
  }
];

const replies = [
  {
    id: 'r1', discussionId: 'd1', authorId: 'u2',
    content: 'For BST delete with two children: find the inorder successor (smallest in right subtree), copy its value, then delete the successor. See Week 4 slides for the full algorithm.',
    createdAt: '2026-04-21T16:00:00Z', isInstructor: true
  },
  {
    id: 'r2', discussionId: 'd1', authorId: 'u5',
    content: 'Drawing the tree on paper before coding makes it much easier to trace through the delete algorithm. Highly recommend it!',
    createdAt: '2026-04-21T09:00:00Z', isInstructor: false
  },
  {
    id: 'r3', discussionId: 'd2', authorId: 'u2',
    content: 'Analyse both cases: average O(n log n) with random pivot and worst case O(n²) with sorted input. Test with a nearly-sorted array to demonstrate the difference.',
    createdAt: '2026-04-25T15:30:00Z', isInstructor: true
  },
  {
    id: 'r4', discussionId: 'd4', authorId: 'u3',
    content: 'Extra examples: d/dx[sin(eˣ)] = cos(eˣ)·eˣ. d/dx[e^(sin x)] = e^(sin x)·cos x. The key is always: outer derivative times inner derivative.',
    createdAt: '2026-04-23T10:00:00Z', isInstructor: true
  },
  {
    id: 'r5', discussionId: 'd6', authorId: 'u2',
    content: 'Download Npcap separately from npcap.com and install it before Wireshark. That resolves the error on Windows 11.',
    createdAt: '2026-04-23T14:00:00Z', isInstructor: true
  },
  {
    id: 'r6', discussionId: 'd8', authorId: 'u2',
    content: 'For regulated industries like banking, Agile with compliance checkpoints works well. Recommend a hybrid approach in your SRS — justify your choice with reference to regulatory requirements.',
    createdAt: '2026-04-24T16:00:00Z', isInstructor: true
  },
  {
    id: 'r7', discussionId: 'd9', authorId: 'u3',
    content: 'If p (0.03) < α (0.05), you REJECT H₀. The evidence is strong enough to conclude the effect is statistically significant.',
    createdAt: '2026-04-21T15:00:00Z', isInstructor: true
  }
];

const quizzes = [
  {
    id: 'q1', courseId: 'c1', title: 'Data Structures — Week 1 Quiz',
    description: 'Test your understanding of arrays, linked lists, and basic complexity analysis.',
    duration: 15, status: 'active', createdBy: 'u2', createdAt: '2026-04-12T08:00:00Z',
    questions: [
      { id: 'q1_1', text: 'What is the time complexity of accessing an element by index in an array?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2 },
      { id: 'q1_2', text: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correctIndex: 1 },
      { id: 'q1_3', text: 'In a singly linked list, what does each node contain?', options: ['Only data', 'Data and two pointers', 'Data and one pointer to the next node', 'Only a pointer'], correctIndex: 2 },
      { id: 'q1_4', text: 'What is the worst-case time complexity of searching in an unsorted array?', options: ['O(1)', 'O(log n)', 'O(n log n)', 'O(n)'], correctIndex: 3 },
      { id: 'q1_5', text: 'Which operation is most efficient in a doubly linked list compared to a singly linked list?', options: ['Insertion at head', 'Search by value', 'Deletion of a known node', 'Access by index'], correctIndex: 2 },
    ]
  },
  {
    id: 'q2', courseId: 'c1', title: 'Trees and Sorting Algorithms Quiz',
    description: 'Covers BST properties, tree traversals, and sorting algorithm complexities.',
    duration: 20, status: 'active', createdBy: 'u2', createdAt: '2026-04-20T08:00:00Z',
    questions: [
      { id: 'q2_1', text: 'In a Binary Search Tree, where is the smallest element always located?', options: ['Root node', 'Rightmost node', 'Leftmost node', 'Any leaf node'], correctIndex: 2 },
      { id: 'q2_2', text: 'Which tree traversal visits nodes in Left → Root → Right order?', options: ['Pre-order', 'Post-order', 'Level-order', 'In-order'], correctIndex: 3 },
      { id: 'q2_3', text: 'What is the average-case time complexity of Quick Sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1 },
      { id: 'q2_4', text: 'Which sorting algorithm is stable and has O(n log n) complexity in all cases?', options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Heap Sort'], correctIndex: 2 },
      { id: 'q2_5', text: 'What is the height of a balanced BST with 15 nodes?', options: ['3', '4', '7', '15'], correctIndex: 1 },
      { id: 'q2_6', text: 'Which traversal of a BST gives elements in sorted order?', options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'], correctIndex: 2 },
    ]
  },
  {
    id: 'q3', courseId: 'c2', title: 'Calculus — Limits and Derivatives Quiz',
    description: 'Quick assessment on limits, continuity, and basic differentiation rules.',
    duration: 15, status: 'active', createdBy: 'u3', createdAt: '2026-04-15T08:00:00Z',
    questions: [
      { id: 'q3_1', text: 'What is the derivative of f(x) = x³?', options: ['x²', '3x', '3x²', '3x³'], correctIndex: 2 },
      { id: 'q3_2', text: 'What is lim(x→0) sin(x)/x?', options: ['0', '∞', 'Undefined', '1'], correctIndex: 3 },
      { id: 'q3_3', text: 'Which rule is used to differentiate a product of two functions?', options: ['Chain Rule', 'Product Rule', 'Quotient Rule', 'Power Rule'], correctIndex: 1 },
      { id: 'q3_4', text: 'What is the derivative of e^x?', options: ['xe^(x-1)', 'e^(x-1)', 'e^x', 'x·e^x'], correctIndex: 2 },
      { id: 'q3_5', text: 'A function is continuous at x = a if:', options: ['f(a) exists only', 'The limit exists only', 'f(a) exists, the limit exists, and they are equal', 'The derivative exists at a'], correctIndex: 2 },
    ]
  },
  {
    id: 'q4', courseId: 'c3', title: 'OOP Concepts Quiz',
    description: 'Test your understanding of the four pillars of Object-Oriented Programming.',
    duration: 12, status: 'active', createdBy: 'u2', createdAt: '2026-04-18T08:00:00Z',
    questions: [
      { id: 'q4_1', text: 'Which OOP principle hides implementation details and exposes only necessary interfaces?', options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'], correctIndex: 3 },
      { id: 'q4_2', text: 'Method overriding is an example of:', options: ['Encapsulation', 'Runtime Polymorphism', 'Compile-time Polymorphism', 'Abstraction'], correctIndex: 1 },
      { id: 'q4_3', text: 'In Java, which keyword is used to inherit a class?', options: ['implements', 'inherits', 'extends', 'super'], correctIndex: 2 },
      { id: 'q4_4', text: 'What is the main purpose of a constructor in a class?', options: ['To destroy objects', 'To initialise object state', 'To override methods', 'To define interfaces'], correctIndex: 1 },
      { id: 'q4_5', text: 'Which concept allows a subclass to be treated as an instance of its superclass?', options: ['Encapsulation', 'Abstraction', 'Overloading', 'Polymorphism'], correctIndex: 3 },
    ]
  }
];

const quizAttempts = [
  {
    id: 'qa1', quizId: 'q1', studentId: 'u4',
    answers: [2, 1, 2, 3, 2], score: 5, total: 5, percentage: 100,
    completedAt: '2026-04-13T10:30:00Z'
  },
  {
    id: 'qa2', quizId: 'q3', studentId: 'u5',
    answers: [2, 3, 1, 2, 2], score: 4, total: 5, percentage: 80,
    completedAt: '2026-04-16T14:00:00Z'
  }
];

const lessonProgress = [
  { id: 'lp1', studentId: 'u4', lessonId: 'l1', courseId: 'c1', completedAt: '2026-04-14T10:00:00Z' },
  { id: 'lp2', studentId: 'u4', lessonId: 'l2', courseId: 'c1', completedAt: '2026-04-15T11:00:00Z' },
  { id: 'lp3', studentId: 'u4', lessonId: 'l3', courseId: 'c1', completedAt: '2026-04-16T09:00:00Z' },
  { id: 'lp4', studentId: 'u4', lessonId: 'l7', courseId: 'c3', completedAt: '2026-04-17T14:00:00Z' },
  { id: 'lp5', studentId: 'u5', lessonId: 'l5', courseId: 'c2', completedAt: '2026-04-15T10:00:00Z' },
  { id: 'lp6', studentId: 'u5', lessonId: 'l6', courseId: 'c2', completedAt: '2026-04-18T11:00:00Z' },
];

module.exports = { users, courses, lessons, enrollments, assignments, submissions, discussions, replies, quizzes, quizAttempts, lessonProgress };
