import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Settings, BookOpen, ChevronDown, ChevronUp, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import HashFunctionReference from '../Visualization/HashFunctionReference';
import { useAlgorithm } from '../../context/AlgorithmContext';
import { useAnimation } from '../../context/AnimationContext';
const AlgorithmControls = ({ needsInput, selectedCategory, selectedAlgorithm, algorithmRunner }) => {
  const { inputValue, setInputValue, shuffleData, resetData, hashConfig, setHashConfig } = useAlgorithm();
  const animationState = useAnimation();
  const { 
    runAnimation, 
    resetVisualization,
  toggleStepMode,
  setMode,
    isStepMode,
    generateNewSteps,
    algorithmSteps,
    currentStepIndex,
    nextStep,
    previousStep,
    playbackSpeed,
    setSpeed,
    goToStep
  } = algorithmRunner;

  const [isGenerating, setIsGenerating] = React.useState(false);
  const showStepNav = (isStepMode || algorithmSteps.length > 0);

  const handleGenerateSteps = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      await Promise.resolve(generateNewSteps());
    } finally {
      setIsGenerating(false);
    }
  };
  const [showHashRef, setShowHashRef] = useState(false);
  
  return (
    <div className="card p-6 space-y-6">
      {/* Input Section (search & recursion categories only) */}
      {needsInput && (selectedCategory === 'searching' || selectedCategory === 'recursive') && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {selectedAlgorithm.includes('search') ? 'Search Target:' : 'Input Value:'}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-lg"
            placeholder={selectedAlgorithm === 'factorial' ? '0-8' : 'Enter value'}
          />
          <p className="text-xs text-gray-600 mt-1">
            {selectedAlgorithm === 'factorial' && 'Valid range: 0-8'}
            {selectedAlgorithm === 'fibonacci' && 'Valid range: 0-10'}
            {selectedAlgorithm === 'tower-hanoi' && 'Valid range: 1-5'}
          </p>
        </div>
      )}

      {/* Hashing Configuration */}
      {selectedCategory === 'hashing' && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-emerald-700 mb-1">Hash Function</label>
            <select
              value={hashConfig.hashFunction}
              onChange={(e) => setHashConfig({ hashFunction: e.target.value })}
              className="w-full px-3 py-2 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="modulo">Modulo</option>
              <option value="polynomial">Polynomial</option>
              <option value="djb2">DJB2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-700 mb-1">Table Size</label>
            <input
              type="number"
              min="3"
              max="31"
              value={hashConfig.tableSize}
              onChange={(e) => setHashConfig({ tableSize: Math.min(31, Math.max(3, parseInt(e.target.value)||7)) })}
              className="w-32 px-4 py-2 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono text-lg"
            />
            <p className="text-xs text-emerald-600 mt-1">Range: 3 - 31</p>
          </div>
          <p className="text-xs text-emerald-700">Adjust hash settings then Generate to see updated distribution.</p>
          <button
            type="button"
            onClick={() => setShowHashRef(v => !v)}
            className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            <BookOpen size={14} />
            {showHashRef ? 'Hide Reference' : 'Show Reference'}
            {showHashRef ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showHashRef && (
            <div className="mt-2">
              <HashFunctionReference />
            </div>
          )}
        </div>
      )}

      {/* Simplified Action Buttons */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-full text-xs font-semibold uppercase tracking-wide text-slate-500">Execution</div>
        <button
          onClick={runAnimation}
          disabled={needsInput && (selectedCategory === 'searching' || selectedCategory === 'recursive') && !inputValue}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg text-white font-medium transition ${
            animationState.isRunning
              ? 'bg-red-600 hover:bg-red-700'
              : (needsInput && (selectedCategory === 'searching' || selectedCategory === 'recursive') && !inputValue)
                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {animationState.isRunning ? (
            <>
              <Pause size={18} />
              Pause
            </>
          ) : animationState.isRunning === false && algorithmRunner.animationMode === 'paused' ? (
            <>
              <Play size={18} />
              Resume
            </>
          ) : (
            <>
              <Play size={18} />
              Start
            </>
          )}
        </button>
        
        <button
          onClick={resetVisualization}
          className="flex items-center gap-3 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition"
        >
          <RotateCcw size={18} />
          Reset
        </button>
        
        {selectedCategory === 'sorting' && (
          <button
            onClick={shuffleData}
            className="flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            <Shuffle size={18} />
            Shuffle
          </button>
        )}
        {selectedCategory === 'hashing' && (
          <button
            onClick={() => algorithmRunner.generateNewSteps()}
            className="flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            <Shuffle size={18} />
            Generate
          </button>
        )}

        {/* Mode Segmented Control */}
        <div className="flex items-center rounded-lg overflow-hidden border border-slate-600">
          <button
            type="button"
            onClick={() => setMode('continuous')}
            className={`px-4 py-2 text-sm font-medium transition ${!isStepMode ? 'bg-slate-600 text-white' : 'bg-slate-700/40 text-slate-300 hover:bg-slate-600/60'}`}
          >Continuous</button>
          <button
            type="button"
            onClick={() => setMode('step')}
            className={`px-4 py-2 text-sm font-medium transition ${isStepMode ? 'bg-purple-600 text-white' : 'bg-slate-700/40 text-slate-300 hover:bg-slate-600/60'}`}
          >Step</button>
        </div>

        {/* Generate Steps (when none) */}
        {algorithmSteps.length === 0 && (
          <button
            onClick={handleGenerateSteps}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Layers size={16} />
            {isGenerating ? 'Generating…' : 'Generate Steps'}
          </button>
        )}
      </div>

      {/* Speed & Step Navigation */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Playback & Steps</div>
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Speed:</label>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs text-gray-500">Slow</span>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.25"
                value={playbackSpeed || 1}
                onChange={e => setSpeed && setSpeed(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">Fast</span>
            </div>
            <span className="text-sm font-mono bg-gray-200 px-3 py-1 rounded-lg text-gray-700 min-w-[60px] text-center">
              {playbackSpeed || 1}x
            </span>
          </div>

          {showStepNav && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={previousStep}
                    disabled={currentStepIndex <= 0}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300/40 disabled:text-slate-400 text-white rounded-lg transition"
                    title="Previous Step"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStepIndex >= algorithmSteps.length - 1}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300/40 disabled:text-slate-400 text-white rounded-lg transition"
                    title="Next Step"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
                {algorithmSteps.length > 0 && (
                  <span className="text-xs font-mono text-gray-600">{currentStepIndex + 1}/{algorithmSteps.length}</span>
                )}
              </div>
              {algorithmSteps.length > 0 && (
                <>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${((currentStepIndex + 1) / algorithmSteps.length) * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={algorithmSteps.length - 1}
                    value={currentStepIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      if (idx !== currentStepIndex) {
                        goToStep(idx);
                      }
                    }}
                    className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((currentStepIndex + 1) / algorithmSteps.length) * 100}%, #e2e8f0 ${((currentStepIndex + 1) / algorithmSteps.length) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmControls;
