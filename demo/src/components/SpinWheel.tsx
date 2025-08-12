'use client';

import { useState } from 'react';

interface SpinWheelProps {
  userName: string;
  onBackToStart: () => void;
}

const prizes = [
  { text: 'BIRYANI10', description: '10% OFF', color: '#ef4444', bgColor: '#fef2f2' },
  { text: 'SPICE20', description: '20% OFF', color: '#3b82f6', bgColor: '#eff6ff' },
  { text: 'FLAVOR15', description: '15% OFF', color: '#10b981', bgColor: '#f0fdf4' },
  { text: 'MASALA25', description: '25% OFF', color: '#8b5cf6', bgColor: '#faf5ff' },
  { text: 'RICE30', description: '30% OFF', color: '#f59e0b', bgColor: '#fffbeb' },
  { text: 'FEAST50', description: '50% OFF', color: '#ec4899', bgColor: '#fdf2f8' },
  { text: 'DELUX40', description: '40% OFF', color: '#6366f1', bgColor: '#eef2ff' },
  { text: 'TASTE35', description: '35% OFF', color: '#f97316', bgColor: '#fff7ed' },
];

export default function SpinWheel({ userName, onBackToStart }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnticipating, setIsAnticipating] = useState(false);

  const spin = () => {
    if (isSpinning || isAnticipating) return;

    // Add anticipation phase
    setIsAnticipating(true);
    setSelectedPrize(null);
    setShowConfetti(false);

    // Small wiggle before spinning (visual only)
    setRotation((Math.random() - 0.5) * 20);

    setTimeout(() => {
      setIsAnticipating(false);
      setIsSpinning(true);

      // Generate random rotation with more realistic physics
      const randomIndex = Math.floor(Math.random() * prizes.length);
      const segmentAngle = 360 / prizes.length;
      // Calculate the exact angle where we want to stop (center of the winning segment), adjusted for pointer at top (-90°)
      const targetSegmentCenter = randomIndex * segmentAngle + (segmentAngle / 2) - 90;
      // Add multiple rotations for dramatic effect (3-5 full rotations)
      const minRotations = 3;
      const maxRotations = 5;
      const extraRotations = minRotations + Math.random() * (maxRotations - minRotations);
      // Calculate final rotation to land on the target
      const finalRotation = (extraRotations * 360) + targetSegmentCenter;

      setRotation(finalRotation);

      // Stop spinning after animation and show result with confetti
      setTimeout(() => {
        setIsSpinning(false);
        setSelectedPrize(prizes[randomIndex].text);
        setShowConfetti(true);
        // Hide confetti after celebration
        setTimeout(() => setShowConfetti(false), 3000);
      }, 3500);
    }, 500); // Anticipation delay
  };

  const copyCode = async () => {
    if (selectedPrize) {
      try {
        await navigator.clipboard.writeText(selectedPrize);
        // You could add a toast notification here
        alert('🎉 Code copied to clipboard! Use it for your biryani order!');
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = selectedPrize;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('🎉 Code copied to clipboard!');
      }
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-orange-600 mb-2 animate-pulse">
        Congratulations {userName}! 🎉
      </h2>
      <p className="text-gray-600 mb-8 text-lg">
        Spin the wheel to get your exclusive biryani discount code!
      </p>

      <div className="relative mx-auto w-80 h-80 mb-8">
        {/* Confetti Animation */}
        {showConfetti && isSpinning && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        {/* SVG Wheel */}
        <div 
          className={`w-full h-full transition-transform ${
            isSpinning 
              ? 'duration-[3500ms]' 
              : isAnticipating 
                ? 'duration-500' 
                : 'duration-700'
          }`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transitionTimingFunction: isSpinning 
              ? 'cubic-bezier(0.17, 0.67, 0.12, 0.99)' // Smooth deceleration like a real wheel
              : isAnticipating
                ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' // Bounce effect for anticipation
                : 'ease-out'
          }}
        >
          <svg width="320" height="320" viewBox="0 0 320 320" className="drop-shadow-2xl">
            {/* Wheel segments */}
            {prizes.map((prize, index) => {
              const segmentAngle = 360 / prizes.length;
              const startAngle = index * segmentAngle - 90; // Start from top
              const endAngle = startAngle + segmentAngle;
              
              // Convert to radians
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              // Calculate arc path
              const radius = 140;
              const centerX = 160;
              const centerY = 160;
              
              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);
              
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              
              const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              // Text position (middle of the segment)
              const textAngle = startAngle + segmentAngle / 2;
              const textRad = (textAngle * Math.PI) / 180;
              const textRadius = 80;
              const textX = centerX + textRadius * Math.cos(textRad);
              const textY = centerY + textRadius * Math.sin(textRad);
              
              return (
                <g key={index}>
                  {/* Segment */}
                  <path
                    d={pathData}
                    fill={prize.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  
                  {/* Text */}
                  <g transform={`translate(${textX}, ${textY}) rotate(${textAngle + 90})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      filter="drop-shadow(1px 1px 1px rgba(0,0,0,0.8))"
                    >
                      <tspan x="0" dy="-5">{prize.text}</tspan>
                      <tspan x="0" dy="10" fontSize="8">{prize.description}</tspan>
                    </text>
                  </g>
                </g>
              );
            })}
            
            {/* Center circle */}
            <circle
              cx="160"
              cy="160"
              r="25"
              fill="url(#centerGradient)"
              stroke="#fff"
              strokeWidth="4"
            />
            
            {/* Gradient definition */}
            <defs>
              <radialGradient id="centerGradient" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30">
          <div className="w-0 h-0 border-l-10 border-r-10 border-t-24 border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
        </div>

        {/* Glow effect when spinning */}
        {isSpinning && (
          <>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-20 animate-ping"></div>
          </>
        )}

        {/* Spinning sound effect simulation */}
        {isSpinning && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-spin">
            ⚡
          </div>
        )}
      </div>

      {!selectedPrize && (
        <div className="text-center">
          <button
            onClick={spin}
            disabled={isSpinning || isAnticipating}
            className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
              isSpinning || isAnticipating
                ? 'bg-gray-400 cursor-not-allowed text-gray-600 scale-95 opacity-70' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 hover:rotate-1'
            }`}
          >
            {isAnticipating ? (
              <div className="flex items-center space-x-3">
                <span className="text-2xl animate-pulse">⚡</span>
                <span className="animate-pulse">Get ready...</span>
                <span className="text-2xl animate-pulse">⚡</span>
              </div>
            ) : isSpinning ? (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="animate-pulse">Spinning the wheel...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎰</span>
                <span>SPIN THE WHEEL!</span>
                <span className="text-2xl">🎰</span>
              </div>
            )}
          </button>
          
          {(isSpinning || isAnticipating) && (
            <div className="mt-6 space-y-2">
              <p className="text-orange-600 font-bold text-lg animate-pulse">
                {isAnticipating ? `Ready ${userName}? 🎯` : `Good luck, ${userName}! 🍀`}
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedPrize && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 mb-4 transform animate-fadeIn">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-3">
              Congratulations {userName}!
            </h3>
            <p className="text-green-700 mb-4">You won an exclusive discount code:</p>
            
            <div className="bg-white border-3 border-dashed border-green-400 rounded-xl p-6 mb-6 transform hover:scale-105 transition-transform">
              <div className="text-3xl font-mono font-bold text-green-600 mb-2">
                {selectedPrize}
              </div>
              <div className="text-lg text-green-500">
                {prizes.find(p => p.text === selectedPrize)?.description} Your Order!
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={copyCode}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                📋 Copy Code to Clipboard
              </button>
              <button
                onClick={onBackToStart}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
