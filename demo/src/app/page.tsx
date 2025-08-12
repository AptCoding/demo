
'use client';

import NameInput from '@/components/NameInput';
import ScreenshotUpload from '@/components/ScreenshotUpload';
import SpinWheel from '@/components/SpinWheel';
import { useState } from 'react';


type Step = 'greeting' | 'name' | 'upload' | 'spin';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('greeting');
  const [userName, setUserName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleGreetingNext = () => {
    setCurrentStep('name');
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setCurrentStep('upload');
  };

  const handleUploadComplete = (file: File) => {
    setUploadedFile(file);
    setCurrentStep('spin');
  };

  const handleBackToStart = () => {
    setCurrentStep('greeting');
    setUserName('');
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {currentStep === 'greeting' && (
          <div className="text-center transform animate-fadeIn">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-orange-600 mb-4 animate-bounce">
                Hi World Famous Biryani Lover! 
              </h1>
              <div className="text-6xl animate-pulse">🍛</div>
            </div>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Welcome to our exclusive biryani lover community! Ready to embark on a delicious journey and win amazing discount codes?
            </p>
            <button
              onClick={handleGreetingNext}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Let&apos;s Get Started!</span>
                <span>🎉</span>
              </span>
            </button>
          </div>
        )}

        {currentStep === 'name' && (
          <NameInput onSubmit={handleNameSubmit} />
        )}

        {currentStep === 'upload' && (
          <ScreenshotUpload 
            userName={userName}
            onUploadComplete={handleUploadComplete}
          />
        )}

        {currentStep === 'spin' && (
          <SpinWheel 
            userName={userName}
            onBackToStart={handleBackToStart}
          />
        )}
      </div>
    </div>
  );
}
