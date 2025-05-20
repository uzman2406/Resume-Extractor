export interface Experience {
  title: string;
  company: string;
  date: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  date: string;
  description?: string;
}

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  summary?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}