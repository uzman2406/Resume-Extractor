import React, { useState } from 'react';
import FileUploader from './FileUploader';
import ResumePreview from './ResumePreview';
import ExtractedData from './ExtractedData';
import { extractResumeData } from '../utils/resumeParser';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ResumeData } from '../types';

const ResumeExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setExtractedData(null);
    setError(null);
  };

  const handleExtract = async () => {
    if (!file) return;
    
    setIsExtracting(true);
    setError(null);
    
    try {
      const data = await extractResumeData(file);
      setExtractedData(data);
    } catch (err) {
      setError('Failed to extract data from the resume. Please try a different file.');
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Extract Data from Resumes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Upload a resume PDF and extract structured information about skills, experience, 
          education, and contact details automatically.
        </p>
      </section>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded"
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FileUploader onFileChange={handleFileChange} />
          
          {file && (
            <div className="mt-6 text-center">
              <button
                onClick={handleExtract}
                disabled={isExtracting}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                          transition-colors duration-200 font-medium focus:outline-none focus:ring-2
                          focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-70
                          disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isExtracting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting...
                  </>
                ) : (
                  'Extract Resume Data'
                )}
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 h-96 overflow-hidden transition-colors duration-300">
          {file ? (
            <ResumePreview file={file} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-center p-4">
              <p>Upload a resume to preview it here</p>
            </div>
          )}
        </div>
      </div>

      {extractedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExtractedData data={extractedData} />
        </motion.div>
      )}
    </div>
  );
};

export default ResumeExtractor;