const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const PartnerRequest = require('./models/PartnerRequest');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/labpartner_db';

const sampleStudents = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    password: 'password123',
    college: 'California Institute of Technology',
    department: 'Computer Science',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Junior CS student passionate about distributed systems and machine learning. Looking for committed partners for OS and ML lab sessions.',
      subjects: ['Data Structures & Algorithms', 'Operating Systems', 'Machine Learning', 'Database Systems'],
      skills: ['Python', 'C++', 'Docker', 'PyTorch', 'Git', 'Linux'],
      interests: ['Artificial Intelligence', 'Distributed Systems', 'Competitive Programming', 'Open Source'],
      studyGoals: ['Lab Project Collaboration', 'Exam Preparation', 'Hackathon Partner'],
      preferredStudyMode: 'Hybrid',
      contactEmail: 'alex.chen@campus.edu',
      phone: '+1 (555) 234-5678',
      github: 'alexchen-dev',
      linkedin: 'alex-chen-cs',
      location: 'Engineering Science Library, 3rd Floor',
      availability: [
        { day: 'Monday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Wednesday', slots: ['Evening (5PM-9PM)', 'Night (9PM-12AM)'] },
        { day: 'Friday', slots: ['Afternoon (12PM-5PM)'] },
        { day: 'Saturday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] },
        { day: 'Sunday', slots: ['Afternoon (12PM-5PM)'] }
      ]
    }
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@campus.edu',
    password: 'password123',
    college: 'California Institute of Technology',
    department: 'Computer Science',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Focusing on Computer Vision and Deep Learning. Love building clean system architectures and solving algorithmic challenges together.',
      subjects: ['Operating Systems', 'Machine Learning', 'Data Structures & Algorithms', 'Computer Vision'],
      skills: ['Python', 'C++', 'OpenCV', 'TensorFlow', 'CUDA'],
      interests: ['Artificial Intelligence', 'Robotics', 'Competitive Programming'],
      studyGoals: ['Lab Project Collaboration', 'Research Paper Publication', 'Exam Preparation'],
      preferredStudyMode: 'Hybrid',
      contactEmail: 'elena.rostova@campus.edu',
      github: 'elena-rostova',
      linkedin: 'elena-rostova',
      location: 'Gates Computer Science Wing',
      availability: [
        { day: 'Monday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Tuesday', slots: ['Afternoon (12PM-5PM)'] },
        { day: 'Wednesday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Saturday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] }
      ]
    }
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@campus.edu',
    password: 'password123',
    college: 'California Institute of Technology',
    department: 'Data Science',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Data Science undergrad building statistical modeling and database pipelines. Enthusiastic about study groups for midterms and group projects.',
      subjects: ['Database Systems', 'Data Structures & Algorithms', 'Machine Learning', 'Probability & Statistics'],
      skills: ['SQL', 'Python', 'R', 'PostgreSQL', 'Scikit-learn'],
      interests: ['Artificial Intelligence', 'Data Analytics', 'Open Source'],
      studyGoals: ['Exam Preparation', 'Lab Project Collaboration', 'Homework & Assignments'],
      preferredStudyMode: 'In-Person',
      contactEmail: 'marcus.vance@campus.edu',
      github: 'marcusvance',
      linkedin: 'marcus-vance-ds',
      location: 'Central Campus Commons',
      availability: [
        { day: 'Monday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Wednesday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Thursday', slots: ['Afternoon (12PM-5PM)'] },
        { day: 'Saturday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] }
      ]
    }
  },
  {
    name: 'Sophia Patel',
    email: 'sophia.patel@campus.edu',
    password: 'password123',
    college: 'Stanford University',
    department: 'Electrical & Computer Eng',
    year: '4th Year',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Senior ECE major working on embedded IoT, FPGA programming, and firmware. Looking for a partner for the capstone hardware laboratory.',
      subjects: ['Embedded Systems', 'Computer Networks', 'Operating Systems', 'VLSI Design'],
      skills: ['C', 'Verilog', 'ARM Cortex', 'RTOS', 'Git'],
      interests: ['Robotics', 'Hardware Security', 'IoT Devices'],
      studyGoals: ['Lab Project Collaboration', 'Research Paper Publication'],
      preferredStudyMode: 'In-Person',
      contactEmail: 'sophia.patel@campus.edu',
      github: 'sophiapatel-ece',
      location: 'Packard Electrical Wing',
      availability: [
        { day: 'Tuesday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] },
        { day: 'Thursday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] },
        { day: 'Saturday', slots: ['Evening (5PM-9PM)'] }
      ]
    }
  },
  {
    name: 'David Kim',
    email: 'david.kim@campus.edu',
    password: 'password123',
    college: 'UC Berkeley',
    department: 'Computer Science',
    year: '2nd Year',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Sophomore preparing rigorously for competitive programming and tech interviews. Let us grind LeetCode, graph algorithms, and DP together.',
      subjects: ['Data Structures & Algorithms', 'Discrete Mathematics', 'Web Development'],
      skills: ['C++', 'Java', 'Algorithms', 'React', 'Node.js'],
      interests: ['Competitive Programming', 'Web Development', 'Hackathons'],
      studyGoals: ['Exam Preparation', 'Hackathon Partner', 'Homework & Assignments'],
      preferredStudyMode: 'Online',
      contactEmail: 'david.kim@campus.edu',
      github: 'dkim-algo',
      linkedin: 'davidkim-cs',
      location: 'Moffitt Library 4th Floor',
      availability: [
        { day: 'Monday', slots: ['Night (9PM-12AM)'] },
        { day: 'Tuesday', slots: ['Night (9PM-12AM)'] },
        { day: 'Wednesday', slots: ['Night (9PM-12AM)'] },
        { day: 'Saturday', slots: ['Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'] },
        { day: 'Sunday', slots: ['Evening (5PM-9PM)', 'Night (9PM-12AM)'] }
      ]
    }
  },
  {
    name: 'Aisha Al-Mansoor',
    email: 'aisha.m@campus.edu',
    password: 'password123',
    college: 'MIT',
    department: 'Artificial Intelligence',
    year: 'Graduate / Masters',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Graduate researcher in Natural Language Processing and LLM Alignment. Looking for dedicated peers for research experiments and compute benchmarks.',
      subjects: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Distributed Systems'],
      skills: ['PyTorch', 'Transformers', 'HuggingFace', 'Kubernetes', 'Python'],
      interests: ['Artificial Intelligence', 'Research', 'Open Source'],
      studyGoals: ['Research Paper Publication', 'Lab Project Collaboration'],
      preferredStudyMode: 'Hybrid',
      contactEmail: 'aisha.m@campus.edu',
      github: 'aishamansoor',
      linkedin: 'aisha-mansoor-ai',
      location: 'Stata Center 3rd Floor',
      availability: [
        { day: 'Monday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] },
        { day: 'Wednesday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] },
        { day: 'Friday', slots: ['Morning (8AM-12PM)'] }
      ]
    }
  },
  {
    name: 'Lucas Rodriguez',
    email: 'lucas.r@campus.edu',
    password: 'password123',
    college: 'Carnegie Mellon',
    department: 'Computer Science',
    year: '4th Year',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Senior working on Cloud Infrastructure and Distributed File Systems. Seeking teammates for system design mock sessions and multi-thread projects.',
      subjects: ['Distributed Systems', 'Operating Systems', 'Cloud Computing', 'Computer Networks'],
      skills: ['Go', 'Rust', 'gRPC', 'Docker', 'AWS', 'Kubernetes'],
      interests: ['Distributed Systems', 'Cloud Architecture', 'Open Source'],
      studyGoals: ['Lab Project Collaboration', 'Exam Preparation'],
      preferredStudyMode: 'Hybrid',
      contactEmail: 'lucas.r@campus.edu',
      github: 'lucas-cloud',
      location: 'Gates Hillman Complex',
      availability: [
        { day: 'Monday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Tuesday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Thursday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Saturday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] }
      ]
    }
  },
  {
    name: 'Ananya Sharma',
    email: 'ananya.sharma@campus.edu',
    password: 'password123',
    college: 'Georgia Tech',
    department: 'Bioengineering',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    profile: {
      bio: 'Computational Biology and Genomics researcher. Looking to team up with someone skilled in Python/ML for DNA sequence alignment lab experiments.',
      subjects: ['Bioinformatics', 'Machine Learning', 'Database Systems', 'Genetics'],
      skills: ['Biopython', 'R', 'Python', 'SQL', 'Data Visualization'],
      interests: ['Bioinformatics', 'Artificial Intelligence', 'Health Tech'],
      studyGoals: ['Lab Project Collaboration', 'Research Paper Publication'],
      preferredStudyMode: 'Hybrid',
      contactEmail: 'ananya.sharma@campus.edu',
      location: 'Biomedical Engineering Annex',
      availability: [
        { day: 'Tuesday', slots: ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)'] },
        { day: 'Wednesday', slots: ['Evening (5PM-9PM)'] },
        { day: 'Friday', slots: ['Afternoon (12PM-5PM)'] },
        { day: 'Sunday', slots: ['Afternoon (12PM-5PM)'] }
      ]
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB for seeding...');

    // Clean existing data
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await PartnerRequest.deleteMany({});
    console.log(' Cleared previous data.');

    const createdUsers = [];

    // Create users & profiles
    for (const student of sampleStudents) {
      const { profile, ...userData } = student;
      const user = await User.create(userData);

      const studentProfile = await StudentProfile.create({
        ...profile,
        user: user._id
      });

      user.profile = studentProfile._id;
      await user.save();
      createdUsers.push(user);
    }

    console.log(` Created ${createdUsers.length} student users and detailed profiles.`);

    // Set up sample requests for Alex Chen (index 0):
    // 1. Accepted partner with Elena Rostova (index 1)
    await PartnerRequest.create({
      sender: createdUsers[0]._id,
      receiver: createdUsers[1]._id,
      status: 'accepted',
      message: 'Hey Elena! We have 3 shared subjects including Operating Systems. Would love to partner for lab reports!'
    });

    // 2. Incoming pending request from Marcus Vance (index 2)
    await PartnerRequest.create({
      sender: createdUsers[2]._id,
      receiver: createdUsers[0]._id,
      status: 'pending',
      message: 'Hi Alex, saw your profile matches my schedule on Saturday mornings. Want to study for the upcoming Database Systems midterm?'
    });

    // 3. Outgoing pending request to Aisha Al-Mansoor (index 5)
    await PartnerRequest.create({
      sender: createdUsers[0]._id,
      receiver: createdUsers[5]._id,
      status: 'pending',
      message: 'Hello Aisha! Impressed by your NLP work. I would love to collaborate on the distributed ML pipeline.'
    });

    console.log(' Created initial sample partner requests and active partnerships.');
    console.log('\n Default Login Credentials:');
    console.log(' Email:    alex.chen@campus.edu');
    console.log(' Password: password123');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    console.log(' Database seed complete and disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error(' Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();

