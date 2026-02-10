export interface EducationEntry {
  school: string
  location: string
  degree: string
  year?: string
}

export interface ExperienceRole {
  title: string
  period: string
  bullets: string[]
}

export interface ExperienceEntry {
  company: string
  location: string
  roles: ExperienceRole[]
}

export interface AdditionalEntry {
  title: string
  period: string
  description: string
}

export interface ResumeData {
  name: string
  location: string
  email: string
  education: EducationEntry[]
  experience: ExperienceEntry[]
  additionalExperience: AdditionalEntry[]
  awards: string[]
  skills: string[]
}

export const resume: ResumeData = {
  name: 'Jonathan Drybanski',
  location: 'Medford, MA 02155',
  email: 'jonny.edry@pm.me',

  education: [
    {
      school: 'Suffolk University',
      location: 'Boston, MA',
      degree: 'Bachelor of Arts, English Literature',
      year: '2012',
    },
    {
      school: 'University of Massachusetts Boston',
      location: '',
      degree: 'Graduate Coursework, English Literature',
    },
  ],

  experience: [
    {
      company: 'Whole Foods Market',
      location: 'Brighton, MA / Newton, MA',
      roles: [
        {
          title: 'Specialty Team Leader',
          period: '2023 – Present',
          bullets: [
            'Full P&L responsibility for Specialty department: hiring, labor budgeting, financial KPIs, and merchandising excellence',
            'Foster positive team culture, clearly communicate standards, and drive exceptional customer service',
          ],
        },
        {
          title: 'Associate Specialty Team Leader',
          period: '2021 – 2023',
          bullets: [
            'Supported daily operations, administrative tasks, team development, and compliance with regional merchandising and food safety standards',
            'Monitored financial metrics, held order writers accountable for purchasing and shrink practices, and highlighted unique local and imported products',
          ],
        },
        {
          title: 'Specialty Order Writer',
          period: '2020 – 2021',
          bullets: [
            'Managed purchasing using product movement data to meet sales goals, minimize shrink, and ensure proper rotation',
            'Conducted vendor outreach and justified all purchasing decisions',
          ],
        },
        {
          title: 'Specialty Team Member',
          period: '2017 – 2020',
          bullets: [
            'Provided knowledgeable, courteous customer service while maintaining planograms, cleanliness, and attractive displays of imported cheeses, charcuterie, and antipasti',
          ],
        },
      ],
    },
    {
      company: 'University of Massachusetts Boston & Suffolk University',
      location: 'Boston, MA',
      roles: [
        {
          title: 'Teaching Assistant',
          period: '2012 – 2014',
          bullets: [
            'Co-taught literature courses, led lectures, graded assignments, and held office hours',
          ],
        },
      ],
    },
  ],

  additionalExperience: [
    {
      title: 'Lead Customer Service Associate',
      period: '2013 – 2015',
      description:
        'Guitar Center, Braintree, MA — Keyholding manager overseeing smooth sales floor operations and first-point customer service resolution. Trained new associates on sales techniques, technical knowledge, and customer service standards',
    },
    {
      title: 'Customer Support & Sales',
      period: '2015 – 2017',
      description:
        'TripAdvisor / Jetsetter — B2B sales, technical troubleshooting, refund handling, and premium feature marketing',
    },
    {
      title: 'Assistant Web Designer',
      period: '2010 – 2013',
      description:
        'Topac Inc. — Updated e-commerce product pages and website content for international scientific equipment vendor',
    },
  ],

  awards: [
    'Guitar Center "Rockstar" Employee Leadership Award',
    'C.P. Harvey Memorial Jazz Scholarship',
    'Bryan King Bilton Memorial Scholarship (Competitive Swimming)',
    'English Honors Society Member',
  ],

  skills: [
    'Retail leadership, team building, P&L management, merchandising',
    'Purchasing, inventory control, shrink reduction',
    'Customer service excellence, communication, presentation',
    'Creative writing and poetry (independent publications)',
    'Music performance, basic web design',
  ],
}
