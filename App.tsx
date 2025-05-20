import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResumeExtractor from './components/ResumeExtractor';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ResumeExtractor />
      </main>
      <Footer />
    </div>
  );
}

export default App;