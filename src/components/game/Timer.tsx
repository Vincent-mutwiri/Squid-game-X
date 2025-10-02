"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Timer({ duration, onTimeUp }: { duration: number; onTimeUp: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  return (
    <div className="flex flex-col items-center space-y-4 mb-6">
      {/* Circular Timer */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={isCritical ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981'}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeDashoffset={2 * Math.PI * 45 * (1 - percentage / 100)}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-linear",
              isCritical && "animate-pulse"
            )}
            style={{
              filter: isCritical ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 
                      isUrgent ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' : 'none'
            }}
          />
        </svg>
        
        {/* Timer Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "text-5xl sm:text-6xl font-bold transition-all duration-300",
            isCritical ? "text-red-600 scale-110 animate-bounce" : 
            isUrgent ? "text-orange-600 scale-105" : "text-green-600"
          )}>
            {timeLeft}
          </div>
        </div>
        
        {/* Pulse Ring Effect for Critical Time */}
        {isCritical && (
          <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75" />
        )}
      </div>
      
      {/* Status Text */}
      <div className={cn(
        "text-sm sm:text-base font-semibold transition-all duration-300",
        isCritical ? "text-red-600 animate-pulse" : 
        isUrgent ? "text-orange-600" : "text-gray-600"
      )}>
        {isCritical ? "⚠️ HURRY!" : isUrgent ? "⏰ Time Running Out" : "⏱️ Time Remaining"}
      </div>
    </div>
  );
}
