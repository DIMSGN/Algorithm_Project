import React from 'react';

const SearchVisualizer = ({ data, animationState, targetValue }) => {
  const maxValue = Math.max(...data);
  
  // Debug logging
  console.log('SearchVisualizer render:', {
    data,
    targetValue,
    isRunning: animationState.isRunning,
    currentStep: animationState.currentStep,
    searching: animationState.searching,
    found: animationState.found
  });
  
  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
      {/* Target value display */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
          🎯 Target: {targetValue || 'Not set'}
        </div>
      </div>

      <div className="flex items-end justify-center gap-3 h-80 mb-6 bg-black/30 rounded-xl p-6 border border-gray-600 relative">
        {/* Visual pointer for current search index */}
        {typeof animationState.searching === 'number' && animationState.searching >= 0 && (
          <div
            className="absolute left-0 right-0 flex justify-center pointer-events-none"
            style={{ top: '-2.5rem', zIndex: 10 }}
          >
            <div style={{
              marginLeft: `${animationState.searching * 56}px`,
              transition: 'margin-left 0.5s cubic-bezier(.4,2,.3,1)',
            }}>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-yellow-500 animate-bounce">↓</div>
                <div className="text-xs font-semibold text-yellow-700">Checking</div>
              </div>
            </div>
          </div>
        )}
        {data.map((value, index) => {
          let barColor = 'bg-gradient-to-t from-blue-500 to-cyan-400';
          let glowColor = 'shadow-blue-500/50';
          let animationClass = 'transform transition-all duration-700 ease-in-out';
          // ...existing color logic...
          if (animationState.searching === index) {
            barColor = 'bg-gradient-to-t from-yellow-500 to-amber-400';
            glowColor = 'shadow-yellow-500/70';
            animationClass += ' scale-110 shadow-2xl animate-pulse';
          } else if (animationState.found === index) {
            barColor = 'bg-gradient-to-t from-emerald-400 to-green-300';
            glowColor = 'shadow-emerald-500/90';
            animationClass += ' scale-125 shadow-2xl';
          } else if (value == targetValue) {
            barColor = 'bg-gradient-to-t from-purple-500 to-violet-400';
            glowColor = 'shadow-purple-500/50';
          }
          const height = (value / maxValue) * 240 + 40;
          return (
            <div key={index} className="flex flex-col items-center group">
              <div
                className={`${barColor} ${glowColor} ${animationClass} rounded-t-xl flex items-end justify-center font-bold text-white text-lg min-w-[48px] relative border-t-2 border-white/20 backdrop-blur-sm`}
                style={{ height: `${height}px` }}
              >
                <span className="mb-3 drop-shadow-lg font-mono">{value}</span>
                {animationState.searching === index && (
                  <div className="absolute -top-12 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
                    🔍 Searching
                  </div>
                )}
                {animationState.found === index && (
                  <div className="absolute -top-12 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
                    ✨ Found!
                  </div>
                )}
                <div className={`absolute inset-0 ${barColor} ${glowColor} rounded-t-xl opacity-20 blur-sm -z-10`}></div>
              </div>
              <div className="text-sm text-gray-400 mt-3 font-mono bg-gray-800/50 px-2 py-1 rounded-md border border-gray-600">
                [{index}]
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Step-by-step explanation panel */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step: {animationState.currentStep + 1} / {animationState.steps.length || 0}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            animationState.isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {animationState.isRunning ? 'Searching' : 'Ready'}
          </span>
        </div>
        <div className="text-sm text-purple-800 font-medium mb-2">
          {animationState.highlight || 'Enter a target value and click "Run Algorithm" to start search'}
        </div>
        {/* Step explanation */}
        {animationState.currentStepData && (
          <div className="text-sm text-gray-700 bg-purple-50 rounded-md p-3 mt-2 border border-purple-200">
            <strong>Explanation:</strong> {animationState.currentStepData.description || animationState.currentStepData.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchVisualizer;