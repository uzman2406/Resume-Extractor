import React from 'react';
import { motion } from 'framer-motion';
import { Download, Award, Briefcase, GraduationCap, User, MapPin, Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { ResumeData } from '../types';

interface ExtractedDataProps {
  data: ResumeData;
}

const ExtractedData: React.FC<ExtractedDataProps> = ({ data }) => {
  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name?.replace(/\s+/g, '_').toLowerCase() || 'resume'}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Extracted Resume Data
        </h2>
        
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </button>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Personal Information */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3 transition-colors duration-300">
            {data.name && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{data.name}</p>
              </div>
            )}
            
            {data.email && (
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{data.email}</p>
                </div>
              </div>
            )}
            
            {data.phone && (
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{data.phone}</p>
                </div>
              </div>
            )}
            
            {data.location && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{data.location}</p>
                </div>
              </div>
            )}
            
            {data.website && (
              <div className="flex items-start">
                <LinkIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{data.website}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Skills */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Skills</h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 transition-colors duration-300">
            {data.skills && data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 
                              rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No skills detected</p>
            )}
          </div>
        </motion.div>
        
        {/* Experience */}
        <motion.div variants={item} className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Experience</h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 transition-colors duration-300">
            {data.experience && data.experience.length > 0 ? (
              <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                {data.experience.map((exp, index) => (
                  <div key={index} className={index === 0 ? '' : 'pt-4'}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800 dark:text-white">{exp.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{exp.date}</p>
                    </div>
                    <p className="text-primary-600 dark:text-primary-400">{exp.company}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No experience details detected</p>
            )}
          </div>
        </motion.div>
        
        {/* Education */}
        <motion.div variants={item} className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Education</h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 transition-colors duration-300">
            {data.education && data.education.length > 0 ? (
              <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                {data.education.map((edu, index) => (
                  <div key={index} className={index === 0 ? '' : 'pt-4'}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800 dark:text-white">{edu.degree}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{edu.date}</p>
                    </div>
                    <p className="text-primary-600 dark:text-primary-400">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No education details detected</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ExtractedData;