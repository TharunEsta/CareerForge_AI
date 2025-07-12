import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { skills, experience } = await request.json();

    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Skills array is required' },
        { status: 400 }
      );
    }

    // Simulate job matching
    const matchingJobs = await findMatchingJobs(skills, experience);
    
    return NextResponse.json({
      jobs: matchingJobs,
      total: matchingJobs.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Job matching error:', error);
    return NextResponse.json(
      { error: 'Failed to find matching jobs' },
      { status: 500 }
    );
  }
}

async function findMatchingJobs(skills: string[], experience: string[]) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const allJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120,000 - $180,000',
      description: 'Build scalable web applications using React, Node.js, and cloud technologies.',
      matchScore: 95,
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS']
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salary: '$90,000 - $130,000',
      description: 'Develop end-to-end solutions with modern web technologies.',
      matchScore: 88,
      skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git']
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Austin, TX',
      salary: '$100,000 - $150,000',
      description: 'Manage infrastructure and deployment pipelines.',
      matchScore: 82,
      skills: ['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD']
    },
    {
      id: '4',
      title: 'Frontend Developer',
      company: 'DesignStudio',
      location: 'Los Angeles, CA',
      salary: '$80,000 - $120,000',
      description: 'Create beautiful user interfaces with React and modern CSS.',
      matchScore: 78,
      skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML']
    },
    {
      id: '5',
      title: 'Backend Engineer',
      company: 'DataFlow',
      location: 'Seattle, WA',
      salary: '$110,000 - $160,000',
      description: 'Build robust APIs and database systems.',
      matchScore: 85,
      skills: ['Python', 'Node.js', 'PostgreSQL', 'MongoDB', 'REST APIs']
    },
    {
      id: '6',
      title: 'Machine Learning Engineer',
      company: 'AI Innovations',
      location: 'Boston, MA',
      salary: '$130,000 - $200,000',
      description: 'Develop AI models and data pipelines.',
      matchScore: 72,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'AWS']
    }
  ];

  // Calculate match scores based on skills overlap
  const scoredJobs = allJobs.map(job => {
    const skillMatches = skills.filter(skill => 
      job.skills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    ).length;
    
    const matchScore = Math.min(100, Math.round((skillMatches / Math.max(skills.length, job.skills.length)) * 100));
    
    return {
      ...job,
      matchScore: matchScore + Math.floor(Math.random() * 10) // Add some randomness
    };
  });

  // Sort by match score and return top matches
  return scoredJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
} 