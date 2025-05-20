Resume Skill Extractor - Project Description

Overview

Resume Skill Extractor is a full-stack web application with the capability to automatically analyze
resumes (PDF, DOCX, or TXT) and pull key skills with Python-driven NLP and PDF text
extraction. The application has an easy-to-use interface (constructed using React) through which users can upload
their resumes and get the visual breakdown of their skills in organized tags within an instant.

Key Features

Resume Upload & Parsing
* Can upload from PDF, DOCX, and TXT
* Text extraction utilises PyMuPDF (fitz) and pdfminer.six
Skill Extraction using NLP
* Keyword-based match against a large skill database
* Handled skill variations (ex. "JS" to "JavaScript")
* Skills are grouped by category (Programming, Web Dev, Data Science, etc.)
User Interface
* Drag-and-drop upload and fast feedback
* At-a-glance skill tags grouped by category
* Responsive design (desktop/mobile)
Deployment-Ready
* Frontend: served on Netlify (static React app)
* Backend: served on Render/Heroku (FastAPI/Python)

Frontend (React)
* React.js (Functional Components, Hooks)
* React Dropzone (File Upload)
* Tailwind CSS (Styling)
* Axios (API Calls)
* React Router (Navigation)
* React Toastify (Notifications)
Backend (Python - FastAPI)
* FastAPI (REST API)
* PyMuPDF (fitz) (Primary PDF parser)
* pdfminer.six (Fallback PDF parser)
* python-docx (DOCX parsing)
* NLTK (Stopword filtering)
* Regex-based NLP (Skill extraction)
Deployment
* Frontend: Netlify
* Backend: Render (preferred) or Heroku

How It Works
1. User Uploads Resume
o Drag-and-drop or file selector for PDF/DOCX/TXT
o File validation (size, format)
2. Backend Processing
o Extracts raw text using PyMuPDF / pdfminer / python-docx
o Analyzes text against a predefined skill database
o Returns structured skill data (categorized & deduplicated)
3. Frontend Display
o Shows skills in color-coded tags grouped by category
o Provides summary stats (total skills found)
o Clean, intuitive UI with loading/error statesUse Cases
* Job Seekers: Quickly identify key skills in their resumes.
* Recruiters: Automate resume screening for skill matching.
* Career Coaches: Help clients optimize their resumes.
