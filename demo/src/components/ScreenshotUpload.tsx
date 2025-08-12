'use client';

import { useState, useRef } from 'react';

interface ScreenshotUploadProps {
  userName: string;
  onUploadComplete: (file: File) => void;
}

export default function ScreenshotUpload({ userName, onUploadComplete }: ScreenshotUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setUploadedFile(file);
      validateAndProceed(file);
    }
  };

  const validateAndProceed = async (file: File) => {
    setIsValidating(true);
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsValidating(false);
    onUploadComplete(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-orange-600 mb-3 animate-pulse">
        Hey {userName}! 📸
      </h2>
      <p className="text-gray-600 mb-8 text-lg">
        Upload a screenshot of your favorite biryani or anything you want to share!
      </p>

      {!uploadedFile && !isValidating && (
        <div
          className={`border-3 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
            dragActive 
              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 scale-105' 
              : 'border-gray-300 hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-yellow-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-orange-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-700 mb-3">
              📷 Drop your screenshot here
            </p>
            <p className="text-lg text-orange-600 font-medium mb-2">
              or click to browse files
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      )}

      {isValidating && (
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <p className="text-xl font-bold text-orange-600 mb-2 animate-pulse">
            Validating your awesome screenshot...
          </p>
          <p className="text-gray-500">
            Making sure it&apos;s as delicious as biryani! 🍛
          </p>
        </div>
      )}

      {uploadedFile && !isValidating && (
        <div className="text-center py-12 transform animate-fadeIn">
          <div className="text-green-600 mb-6">
            <div className="relative">
              <svg className="mx-auto h-20 w-20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-2">
            Perfect! Screenshot validated successfully! ✨
          </p>
          <p className="text-lg text-green-500">
            Get ready for the spin wheel! 🎰
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
