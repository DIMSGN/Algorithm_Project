import React from 'react';
import { useAlgorithm } from '../../context/AlgorithmContext';
import { useAnimation } from '../../context/AnimationContext';

const AlgorithmStatus = ({ algorithmRunner, selectedCategory, selectedAlgorithm }) => {
  const { data } = useAlgorithm();
  const animationState = useAnimation();
  
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm">
      <div className="flex justify-between items-center">
        <span className="font-medium text-blue-400">
          {selectedAlgorithm?.replace('-', ' ')}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          animationState.isRunning 
            ? 'bg-green-600/20 text-green-400' 
            : 'bg-blue-600/20 text-blue-400'
        }`}>
          {animationState.isRunning ? 'Running' : 'Ready'}
        </span>
      </div>
      
      <div className="mt-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>Data Length:</span>
          <span className="font-mono">{data.length}</span>
        </div>
        
        {algorithmRunner.algorithmSteps && (
          <div className="flex justify-between mt-1">
            <span>Total Steps:</span>
            <span className="font-mono">{algorithmRunner.algorithmSteps.length}</span>
          </div>
        )}
        
        {selectedCategory === 'sorting' && (
          <div className="flex justify-between mt-1">
            <span>Array Status:</span>
            <span className="font-mono">
              {algorithmRunner.currentStepIndex >= algorithmRunner.algorithmSteps.length - 1 ? 'Sorted' : 'Unsorted'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmStatus;