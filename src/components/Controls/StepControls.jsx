import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Zap,
  RotateCcw
} from 'lucide-react';

const StepControls = ({ 
  algorithmRunner,
  className = ""
}) => {
  const {
    runAnimation,
    resetVisualization,
    nextStep,
    previousStep,
    toggleStepMode,
    setSpeed,
    algorithmSteps,
    currentStepIndex,
    isStepMode,
    animationMode,
    playbackSpeed,
    isAnimationRunning,
    generateNewSteps
  } = algorithmRunner;

  const speedOptions = [0.25, 0.5, 1, 1.5, 2, 3];

  const currentStep = currentStepIndex >= 0 ? algorithmSteps[currentStepIndex] : null;

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 ${className}`}>
      {/* Simplified Step Controls */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={toggleStepMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            isStepMode
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-slate-600 hover:bg-slate-700 text-white'
          }`}
        >
          <Layers size={16} />
          {isStepMode ? 'Step by Step' : 'Continuous'}
        </button>

        {/* Only show generate button when no steps exist */}
        {algorithmSteps.length === 0 && (
          <button
            onClick={generateNewSteps}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Layers size={16} />
            Generate Steps
          </button>
        )}
      </div>

      {/* Step Navigation (visible in step mode or when steps are available) */}
      {(isStepMode || algorithmSteps.length > 0) && (
        <div className="space-y-3">
          {/* Simplified Step Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Previous step button */}
              <button
                onClick={previousStep}
                disabled={currentStepIndex <= 0}
                className="flex items-center gap-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700/50 disabled:text-slate-500 text-white rounded-lg transition"
                title="Previous Step"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              {/* Next step button */}
              <button
                onClick={nextStep}
                disabled={currentStepIndex >= algorithmSteps.length - 1}
                className="flex items-center gap-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700/50 disabled:text-slate-500 text-white rounded-lg transition"
                title="Next Step"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Simple speed selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="bg-slate-700 text-white border border-slate-600 rounded-lg px-2 py-1 text-sm"
              >
                {speedOptions.map(speed => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step Progress Bar */}
          {algorithmSteps.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Step {currentStepIndex + 1} of {algorithmSteps.length}</span>
                <span>{Math.round(((currentStepIndex + 1) / algorithmSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / algorithmSteps.length) * 100}%`
                  }}
                />
              </div>
              
              {/* Improved Step scrubber */}
              <input
                type="range"
                min="0"
                max={algorithmSteps.length - 1}
                value={currentStepIndex}
                onChange={(e) => {
                  const stepIndex = Number(e.target.value);
                  if (stepIndex !== currentStepIndex) {
                    algorithmRunner.goToStep(stepIndex);
                  }
                }}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((currentStepIndex + 1) / algorithmSteps.length) * 100}%, #475569 ${((currentStepIndex + 1) / algorithmSteps.length) * 100}%, #475569 100%)`
                }}
              />
            </div>
          )}

          {/* Improved Current Step Information */}
          {currentStep && (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-400">
                  Step {currentStep.stepNumber || currentStepIndex + 1} of {algorithmSteps.length}
                </span>
                {currentStep.type && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentStep.type.includes('complete') || currentStep.type.includes('found') ? 'bg-green-600/20 text-green-400' :
                    currentStep.type.includes('compare') || currentStep.type.includes('swap') ? 'bg-yellow-600/20 text-yellow-400' :
                    currentStep.type.includes('error') || currentStep.type.includes('collision') ? 'bg-red-600/20 text-red-400' :
                    'bg-blue-600/20 text-blue-400'
                  }`}>
                    {currentStep.type.replace('-', ' ')}
                  </span>
                )}
              </div>
              {currentStep.message && (
                <p className="text-sm text-slate-300">{currentStep.message}</p>
              )}
              {currentStep.highlight && (
                <p className="text-sm text-emerald-400 font-medium">{currentStep.highlight}</p>
              )}
              {currentStep.description && (
                <p className="text-xs text-slate-400">{currentStep.description}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepControls;