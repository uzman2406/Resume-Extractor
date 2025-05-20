import React, { useCallback, useState } from 'react';
import { FileUp, File, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onFileChange(file);
      }
    }
  }, [onFileChange]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileChange(file);
    }
  }, [onFileChange]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    onFileChange(null);
  }, [onFileChange]);

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200
                ${isDragging 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-700'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className="space-y-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-xs mx-auto"
          >
            <File className="h-6 w-6 text-primary-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
              {selectedFile.name}
            </span>
            <button 
              onClick={handleRemoveFile}
              className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · PDF
          </p>
        </div>
      ) : (
        <>
          <FileUp className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Drag & Drop Resume PDF
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            or click to browse from your computer
          </p>
          <label className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                           cursor-pointer transition-colors duration-200 inline-block">
            Browse Files
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Supported format: PDF
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploader;