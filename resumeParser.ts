import { pdfjs } from 'react-pdf';
import { ResumeData } from '../types';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Common resume section headers
const SECTION_HEADERS = {
  experience: ['experience', 'work experience', 'employment history', 'work history', 'professional experience'],
  education: ['education', 'educational background', 'academic background', 'academic history'],
  skills: ['skills', 'technical skills', 'core competencies', 'areas of expertise', 'key skills'],
  summary: ['summary', 'professional summary', 'career summary', 'profile summary', 'objective'],
};

// Common skill keywords for technical resumes
const TECHNICAL_SKILLS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
  'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
  'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material ui',
  'sql', 'mysql', 'postgresql', 'mongodb', 'firebase', 'dynamodb', 'redis',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
  'agile', 'scrum', 'kanban', 'waterfall', 'tdd', 'ci/cd',
  'typescript', 'graphql', 'rest api', 'json', 'xml',
  'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
  'ux', 'ui', 'figma', 'sketch', 'adobe xd',
];

/**
 * Extracts text content from a PDF file
 */
const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
};

/**
 * Extracts the contact information from resume text
 */
const extractContactInfo = (text: string) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const phoneRegex = /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/g;
  const websiteRegex = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))|([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+)/gi;
  
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const websites = text.match(websiteRegex) || [];
  
  // Filter out emails from websites
  const filteredWebsites = websites.filter(site => !emails.includes(site));
  
  return {
    email: emails.length > 0 ? emails[0] : undefined,
    phone: phones.length > 0 ? phones[0] : undefined,
    website: filteredWebsites.length > 0 ? filteredWebsites[0] : undefined
  };
};

/**
 * Extracts the name from the beginning of the resume
 */
const extractName = (text: string): string | undefined => {
  // Usually the name is at the beginning of the resume
  const lines = text.split('\n').slice(0, 5);
  
  // Look for a line that's likely to be a name (short, no common section titles)
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (
      trimmedLine &&
      trimmedLine.length > 3 &&
      trimmedLine.length < 40 &&
      !trimmedLine.match(/resume|curriculum|vitae|cv|summary|profile|contact|information|experience|education|skills/i)
    ) {
      return trimmedLine;
    }
  }
  
  return undefined;
};

/**
 * Extracts location from the resume text
 */
const extractLocation = (text: string): string | undefined => {
  // Common location patterns in resumes
  const locationPatterns = [
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})/,  // City, STATE
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Za-z\s]+)/,  // City, State/Province
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/  // Just city
  ];
  
  const lines = text.split('\n').slice(0, 10); // Check first 10 lines
  
  for (const line of lines) {
    for (const pattern of locationPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[0];
      }
    }
  }
  
  return undefined;
};

/**
 * Extracts skills from resume text based on keywords
 */
const extractSkills = (text: string): string[] => {
  const skills: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Look for skill keywords
  for (const skill of TECHNICAL_SKILLS) {
    if (lowerText.includes(skill)) {
      // Capitalize skill words properly
      skills.push(skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '));
    }
  }
  
  // Look for skills sections
  const skillsSectionRegex = new RegExp(
    `(${SECTION_HEADERS.skills.join('|')})\\s*:?\\s*(.+?)(?=\\n\\s*\\n|$)`,
    'is'
  );
  
  const skillsMatch = text.match(skillsSectionRegex);
  if (skillsMatch && skillsMatch[2]) {
    // Extract potential skills from bullet points or comma-separated lists
    const sectionSkills = skillsMatch[2]
      .split(/[,•·\-\n]/g)
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 30); // Filter out very short or long items
    
    for (const skill of sectionSkills) {
      if (!skills.includes(skill) && !skill.match(/^\d/)) {
        skills.push(skill);
      }
    }
  }
  
  return [...new Set(skills)].slice(0, 15); // Return unique skills, limit to top 15
};

/**
 * Tries to extract work experience from the resume
 */
const extractExperience = (text: string): Array<{ title: string; company: string; date: string; description: string }> => {
  const experiences: Array<{ title: string; company: string; date: string; description: string }> = [];
  
  // Try to find experience section
  let experienceSection = '';
  const expSectionRegex = new RegExp(
    `(${SECTION_HEADERS.experience.join('|')})\\s*:?\\s*(.+?)(?=(${Object.values(SECTION_HEADERS).flat().join('|')})\\s*:|$)`,
    'is'
  );
  
  const expMatch = text.match(expSectionRegex);
  if (expMatch && expMatch[2]) {
    experienceSection = expMatch[2];
  }
  
  if (experienceSection) {
    // Look for job blocks (title, company, dates)
    const jobBlocks = experienceSection.split(/\n\s*\n/);
    
    for (const block of jobBlocks) {
      if (block.trim()) {
        // Sample pattern matching - this is simplified and would need to be more robust
        const titleMatch = block.match(/([A-Z][a-zA-Z\s]+)(?=\n|,|\sat\s)/);
        const companyMatch = block.match(/(?:at|,)\s*([A-Z][a-zA-Z0-9\s&.,]+)/i) || 
                            block.match(/([A-Z][a-zA-Z0-9\s&.,]+)(?=\n)/);
        const dateMatch = block.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|20\d\d|19\d\d)[\s\-–—]+(Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|20\d\d|19\d\d)/i);
        
        if (titleMatch || companyMatch) {
          experiences.push({
            title: titleMatch ? titleMatch[1].trim() : 'Position',
            company: companyMatch ? companyMatch[1].trim() : 'Company',
            date: dateMatch ? dateMatch[0].trim() : '',
            description: block.replace(titleMatch?.[0] || '', '')
                          .replace(companyMatch?.[0] || '', '')
                          .replace(dateMatch?.[0] || '', '')
                          .trim()
                          .substring(0, 200) // Limit description length
          });
        }
      }
    }
  }
  
  return experiences.slice(0, 3); // Return top 3 experiences
};

/**
 * Tries to extract education information from the resume
 */
const extractEducation = (text: string): Array<{ degree: string; institution: string; date: string; description?: string }> => {
  const education: Array<{ degree: string; institution: string; date: string; description?: string }> = [];
  
  // Try to find education section
  let educationSection = '';
  const eduSectionRegex = new RegExp(
    `(${SECTION_HEADERS.education.join('|')})\\s*:?\\s*(.+?)(?=(${Object.values(SECTION_HEADERS).flat().join('|')})\\s*:|$)`,
    'is'
  );
  
  const eduMatch = text.match(eduSectionRegex);
  if (eduMatch && eduMatch[2]) {
    educationSection = eduMatch[2];
  }
  
  if (educationSection) {
    // Look for education blocks
    const eduBlocks = educationSection.split(/\n\s*\n/);
    
    for (const block of eduBlocks) {
      if (block.trim()) {
        // Match degree, institution and dates
        const degreeMatch = block.match(/([A-Z][a-zA-Z\s]+(?:Degree|Bachelor|Master|PhD|Doctorate|BSc|BA|MS|MSc|MBA|MD|JD|in\s[A-Z][a-zA-Z\s]+))/i);
        const institutionMatch = block.match(/([A-Z][a-zA-Z\s]+(?:University|College|Institute|School))/i);
        const dateMatch = block.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|20\d\d|19\d\d)[\s\-–—]+(Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|20\d\d|19\d\d)/i);
        
        if (degreeMatch || institutionMatch) {
          education.push({
            degree: degreeMatch ? degreeMatch[1].trim() : 'Degree',
            institution: institutionMatch ? institutionMatch[1].trim() : 'Institution',
            date: dateMatch ? dateMatch[0].trim() : '',
            description: block.replace(degreeMatch?.[0] || '', '')
                            .replace(institutionMatch?.[0] || '', '')
                            .replace(dateMatch?.[0] || '', '')
                            .trim()
                            .substring(0, 100) // Limit description length
          });
        }
      }
    }
  }
  
  return education.slice(0, 2); // Return top 2 education entries
};

/**
 * Main function to extract resume data from a PDF file
 */
export const extractResumeData = async (file: File): Promise<ResumeData> => {
  try {
    // Extract text from PDF
    const text = await extractTextFromPDF(file);
    
    // Process the text to extract structured information
    const contactInfo = extractContactInfo(text);
    const name = extractName(text);
    const location = extractLocation(text);
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);
    
    // Return structured data
    return {
      name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      location,
      website: contactInfo.website,
      skills,
      experience,
      education
    };
  } catch (error) {
    console.error('Error extracting resume data:', error);
    throw new Error('Failed to extract resume data');
  }
};