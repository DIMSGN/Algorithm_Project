import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, CheckCircle } from 'lucide-react';

const SortingVisualizer = ({ data, animationState }) => {
  const maxValue = Math.max(...data) || 1;
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [accessCount, setAccessCount] = useState(0);
  
  // Track statistics
  useEffect(() => {
    if (animationState.currentStep) {
      const step = animationState.currentStep;
      if (step.type === 'compare') {
        setComparisons(prev => prev + 1);
        setAccessCount(prev => prev + 2); // Two array accesses for comparison
      } else if (step.type === 'swap') {
        setSwaps(prev => prev + 1);
        setAccessCount(prev => prev + 4); // Four array accesses for swap
      } else if (step.type === 'initialize') {
        setComparisons(0);
        setSwaps(0);
        setAccessCount(0);
      }
    }
  }, [animationState.currentStep]);
  
  // Debug logging
  console.log('SortingVisualizer render:', {
    data,
    isRunning: animationState.isRunning,
    currentStep: animationState.currentStep,
    comparing: animationState.comparing,
    swapping: animationState.swapping,
    sorted: animationState.sorted
  });
  
  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl space-y-6">
      {/* Header with Statistics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sorting Visualization</h2>
            <p className="text-sm text-gray-400">{data.length} elements</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{comparisons}</div>
            <div className="text-slate-400">Comparisons</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{swaps}</div>
            <div className="text-slate-400">Swaps</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{accessCount}</div>
            <div className="text-slate-400">Array Access</div>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="relative">
        <div className="flex items-end justify-center gap-2 h-80 bg-black/30 rounded-xl p-6 border border-gray-600 overflow-x-auto">
          {data.map((value, index) => {
            let barColor = 'bg-gradient-to-t from-blue-500 to-cyan-400';
            let glowColor = 'shadow-blue-500/50';
            let animationClass = 'transform transition-all duration-500 ease-in-out hover:scale-105';
            let tooltip = `Value: ${value}, Index: ${index}`;
            
            // Enhanced color coding with detailed states
            if (animationState.comparing?.includes(index)) {
              barColor = 'bg-gradient-to-t from-yellow-500 to-amber-400';
              glowColor = 'shadow-yellow-500/70';
              animationClass += ' scale-110 shadow-2xl animate-pulse';
              tooltip += ' (Comparing)';
            } else if (animationState.swapping?.includes(index)) {
              barColor = 'bg-gradient-to-t from-red-500 to-pink-400';
              glowColor = 'shadow-red-500/70';
              animationClass += ' scale-105 shadow-2xl animate-bounce';
              tooltip += ' (Swapping)';
            } else if (animationState.sorted?.includes(index)) {
              barColor = 'bg-gradient-to-t from-emerald-500 to-green-400';
              glowColor = 'shadow-green-500/70';
              animationClass += ' shadow-xl';
              tooltip += ' (Sorted)';
            } else if (animationState.shifting?.includes(index)) {
              barColor = 'bg-gradient-to-t from-purple-500 to-violet-400';
              glowColor = 'shadow-purple-500/70';
              animationClass += ' scale-110 shadow-2xl';
              tooltip += ' (Shifting)';
            } else if (animationState.searching === index) {
              barColor = 'bg-gradient-to-t from-indigo-500 to-blue-400';
              glowColor = 'shadow-indigo-500/70';
              animationClass += ' scale-110 shadow-2xl animate-pulse';
              tooltip += ' (Searching)';
            } else if (animationState.found === index) {
              barColor = 'bg-gradient-to-t from-emerald-400 to-cyan-300';
              glowColor = 'shadow-emerald-500/90';
              animationClass += ' scale-125 shadow-2xl';
              tooltip += ' (Found)';
            }
            
            const height = (value / maxValue) * 240 + 40;
            const width = Math.max(30, Math.min(60, 400 / data.length));
          
          return (
            <div key={index} className="flex flex-col items-center group">
              <div
                className={`${barColor} ${glowColor} ${animationClass} rounded-t-xl flex items-end justify-center font-bold text-white text-lg min-w-[48px] relative border-t-2 border-white/20 backdrop-blur-sm`}
                style={{ height: `${height}px` }}
              >
                <span className="mb-3 drop-shadow-lg font-mono">{value}</span>
                
                {/* Enhanced status indicators */}
                {animationState.comparing?.includes(index) && (
                  <div className="absolute -top-12 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
                    🔍 Comparing
                  </div>
                )}
                {animationState.swapping?.includes(index) && (
                  <div className="absolute -top-12 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
                    🔄 Swapping
                  </div>
                )}
                {animationState.found === index && (
                  <div className="absolute -top-12 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
                    ✨ Found!
                  </div>
                )}

                {/* Glow effect */}
                <div className={`absolute inset-0 ${barColor} ${glowColor} rounded-t-xl opacity-20 blur-sm -z-10`}></div>
              </div>
              
              {/* Enhanced index display */}
              <div className="text-sm text-gray-400 mt-3 font-mono bg-gray-800/50 px-2 py-1 rounded-md border border-gray-600">
                [{index}]
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Current step indicator */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            Status: {animationState.isRunning ? 'Running' : 'Ready'}
          </span>
        </div>
        <div className="text-sm text-emerald-400 font-medium">
          {animationState.highlight || 'Click "Run Algorithm" to start sorting visualization'}
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
