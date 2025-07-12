import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or Word documents only.' },
        { status: 400 }
      );
    }

    // Simulate resume parsing
    const parsedData = await parseResume(file);
    
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}

async function parseResume(file: File) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

  // Mock parsed data based on file name
  const fileName = file.name.toLowerCase();
  
  const mockData = {
    skills: [
      'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'AWS',
      'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL'
    ],
    education: [
      'Bachelor of Science in Computer Science - University of Technology (2018-2022)',
      'Master of Business Administration - Business School (2022-2024)',
      'Certified Scrum Master (CSM) - Scrum Alliance (2023)'
    ],
    experience: [
      'Senior Software Engineer - Tech Corp (2022-Present)',
      'Full Stack Developer - Startup Inc (2020-2022)',
      'Junior Developer - Web Solutions (2018-2020)'
    ],
    summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams.',
    full_name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  };

  // Add some randomness to make it feel more realistic
  const randomSkills = mockData.skills.slice(0, 8 + Math.floor(Math.random() * 6));
  const randomEducation = mockData.education.slice(0, 1 + Math.floor(Math.random() * 2));
  const randomExperience = mockData.experience.slice(0, 2 + Math.floor(Math.random() * 2));

  return {
    skills: randomSkills,
    education: randomEducation,
    experience: randomExperience,
    summary: mockData.summary,
    full_name: mockData.full_name,
    email: mockData.email,
    phone: mockData.phone,
    location: mockData.location
  };
} 