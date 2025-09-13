import { useRef, useState, useCallback } from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useAnimation } from '../context/AnimationContext';
import { useLogs } from '../context/LogsContext';
import { bubbleSortSteps, selectionSortSteps, insertionSortSteps, mergeSortSteps, quickSortSteps } from '../algorithms/sorting';
import { linearSearchSteps, binarySearchSteps } from '../algorithms/searching';
import { factorialSteps, fibonacciSteps, towerOfHanoiSteps } from '../algorithms/recursion';
import { hashWithChainingSteps, hashWithLinearProbingSteps, hashFunctions } from '../algorithms/hashing';

export const useAlgorithmRunner = () => {
  const { selectedAlgorithm, data, setData, inputValue, resetData, hashConfig } = useAlgorithm();
  const animationState = useAnimation();
  const { addLog } = useLogs();
  const isAnimationRunning = useRef(false);
  const animationTimeoutRef = useRef(null);
  const justStartedRef = useRef(false); // Prevent immediate pause due to accidental double invocation
  
  // Enhanced step-based state
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isStepMode, setIsStepMode] = useState(false);
  const animationModeRef = useRef('continuous');
  const [animationMode, setAnimationMode] = useState('continuous'); // 'continuous', 'step-by-step', 'paused'
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // Speed multiplier

  // Generate algorithm steps
  const generateSteps = useCallback(() => {
    if (!selectedAlgorithm) {
      addLog('Please select an algorithm first', 'warning');
      return [];
    }

    let steps = [];
    addLog(`Generating steps for ${selectedAlgorithm}...`, 'info');
    addLog(`Current data: [${data.join(', ')}]`, 'info');
    
    try {
      switch (selectedAlgorithm) {
        case 'bubble-sort':
          steps = bubbleSortSteps(data);
          break;
        case 'selection-sort':
          steps = selectionSortSteps(data);
          break;
        case 'insertion-sort':
          steps = insertionSortSteps(data);
          break;
        case 'merge-sort':
          steps = mergeSortSteps(data);
          break;
        case 'quick-sort':
          steps = quickSortSteps(data);
          break;
        case 'binary-search':
          if (!inputValue) {
            addLog('Please enter a search target', 'error');
            return;
          }
          const sortedData = [...data].sort((a, b) => a - b);
          setData(sortedData);
          steps = binarySearchSteps(sortedData, parseInt(inputValue));
          break;
        case 'linear-search':
          if (!inputValue) {
            addLog('Please enter a search target', 'error');
            return;
          }
          steps = linearSearchSteps(data, parseInt(inputValue));
          break;
        case 'factorial':
          if (!inputValue || parseInt(inputValue) < 0 || parseInt(inputValue) > 8) {
            addLog('Please enter a number between 0 and 8', 'error');
            return;
          }
          steps = factorialSteps(parseInt(inputValue));
          break;
        case 'fibonacci':
          if (!inputValue || parseInt(inputValue) < 0 || parseInt(inputValue) > 10) {
            addLog('Please enter a number between 0 and 10', 'error');
            return;
          }
          steps = fibonacciSteps(parseInt(inputValue));
          break;
        case 'tower-hanoi':
          if (!inputValue || parseInt(inputValue) < 1 || parseInt(inputValue) > 5) {
            addLog('Please enter a number between 1 and 5', 'error');
            return;
          }
          steps = towerOfHanoiSteps(parseInt(inputValue));
          break;
        case 'hash-chaining': {
          const sampleKeys = ['apple', 'banana', 'cat', 'dog', 'elephant', 'fox'];
          const keys = data.length > 0 ? data.map(num => `key${num}`) : sampleKeys;
          const size = hashConfig?.tableSize || 7;
          const fn = hashConfig?.hashFunction || 'modulo';
          steps = hashWithChainingSteps(keys, size, fn);
          addLog(`Using ${fn} hash function with chaining`, 'info');
          break; 
        }
        case 'hash-probing': {
          const sampleKeys = ['apple', 'banana', 'cat', 'dog', 'elephant', 'fox'];
          const keys = data.length > 0 ? data.map(num => `key${num}`) : sampleKeys;
          const size = hashConfig?.tableSize || 7;
          const fn = hashConfig?.hashFunction || 'modulo';
          steps = hashWithLinearProbingSteps(keys, size, fn);
          addLog(`Using ${fn} hash function with linear probing`, 'info');
          break; 
        }
        default:
          addLog('Algorithm not yet implemented', 'warning');
          return [];
      }

      if (steps.length === 0) {
        addLog('No steps generated for this algorithm', 'warning');
        return [];
      }

      addLog(`Generated ${steps.length} animation steps`, 'info');
      return steps;
    } catch (error) {
      addLog(`Error generating steps: ${error.message}`, 'error');
      return [];
    }
  }, [selectedAlgorithm, data, inputValue, addLog, setData]);

  // Execute a single step (optionally using provided steps array to avoid stale state)
  const executeStep = useCallback((stepIndex, stepsArrayOverride) => {
    const source = stepsArrayOverride || algorithmSteps;
    if (stepIndex < 0 || stepIndex >= source.length) return;

    const step = source[stepIndex];
    if (!step) return;
    console.log(`Executing step ${stepIndex}:`, step);

    if (step.array) {
      setData([...step.array]);
    }
    animationState.setCurrentStep(stepIndex, step);

    const logType = ['found', 'mark-sorted', 'complete', 'insert'].includes(step.type) ? 'success' : 'info';
    const message = step.message || `Step ${stepIndex + 1}`;
    const detail = step.description ? ` - ${step.description}` : '';
    addLog(message + detail, logType);

    setCurrentStepIndex(stepIndex);
  }, [algorithmSteps, setData, animationState, addLog]);

  // Step-by-step navigation
  const nextStep = useCallback(() => {
    if (currentStepIndex < algorithmSteps.length - 1) {
      executeStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, algorithmSteps.length, executeStep]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      executeStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, executeStep]);

  const goToStep = useCallback((stepIndex) => {
    executeStep(stepIndex);
  }, [executeStep]);

  // Continuous animation with enhanced controls
  const lastActionRef = useRef({ ts: 0, type: null });

  // Helper for running the animation loop from a given step
  // Always keep animationModeRef in sync with state
  const setAnimationModeSynced = (mode) => {
    animationModeRef.current = mode;
    setAnimationMode(mode);
  };

  const runAnimationLoop = async (stepsLocal, startIdx) => {
    try {
      for (let i = Math.max(0, startIdx); i < stepsLocal.length; i++) {
        // Always check latest ref values
        if (!isAnimationRunning.current || animationModeRef.current === 'paused') return;
        executeStep(i, stepsLocal);
        const baseDelay = animationState.speed;
        const adjustedDelay = Math.max(50, baseDelay / playbackSpeed);
        await new Promise((resolve) => {
          animationTimeoutRef.current = setTimeout(() => resolve(), adjustedDelay);
        });
      }
      isAnimationRunning.current = false;
      setAnimationModeSynced('continuous');
      animationState.stopAnimation();
      addLog('Algorithm execution completed!', 'success');
    } catch (e) {
      isAnimationRunning.current = false;
      setAnimationModeSynced('continuous');
      addLog(`Error during animation: ${e.message}`, 'error');
      animationState.stopAnimation();
    }
  };

  const runAnimation = async () => {
    const now = Date.now();
    // Throttle very rapid clicks (<80ms)
    if (now - lastActionRef.current.ts < 80) return;
    lastActionRef.current = { ts: now, type: 'invoke' };

    const mode = animationMode;

    // CASE 1: Currently running -> request pause
    if (isAnimationRunning.current && mode === 'continuous') {
      isAnimationRunning.current = false; // signal loop to exit
      setAnimationModeSynced('paused');
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      animationState.stopAnimation();
      addLog('Animation paused', 'warning');
      return;
    }

    // CASE 2: Resume from paused
    if (!isAnimationRunning.current && mode === 'paused') {
      setAnimationModeSynced('continuous');
      isAnimationRunning.current = true;
      addLog('Animation resumed', 'info');
      const stepsLocal = algorithmSteps.length ? algorithmSteps : generateSteps();
      if (!stepsLocal || stepsLocal.length === 0) {
        isAnimationRunning.current = false;
        return;
      }
      if (algorithmSteps.length === 0) setAlgorithmSteps(stepsLocal);
      animationState.startAnimation(stepsLocal);
      runAnimationLoop(stepsLocal, currentStepIndex + 1);
      return;
    }

    // CASE 3: Fresh start (not running, not paused)
    if (!isAnimationRunning.current && (mode === 'continuous' || mode === 'step-by-step')) {
      if (mode === 'step-by-step') {
        // In step mode we don't auto-run; just generate steps if missing
        if (algorithmSteps.length === 0) {
          const stepsNew = generateSteps();
          if (stepsNew.length > 0) {
            setAlgorithmSteps(stepsNew);
            animationState.startAnimation(stepsNew);
            addLog('Steps generated (step mode). Use Next to advance.', 'info');
          }
        }
        return; // Do not auto-play in step mode
      }

      // Continuous fresh start
      let stepsLocal = algorithmSteps;
      if (stepsLocal.length === 0) {
        stepsLocal = generateSteps();
        if (stepsLocal.length === 0) return;
        setAlgorithmSteps(stepsLocal);
      }
  setAnimationModeSynced('continuous');
      isAnimationRunning.current = true;
      animationState.startAnimation(stepsLocal);
      addLog('Animation started', 'info');
      runAnimationLoop(stepsLocal, currentStepIndex + 1);
      return;
    }
  };

  // Step mode toggle
  const toggleStepMode = useCallback(() => {
    setIsStepMode(!isStepMode);
    if (!isStepMode) {
      // Entering step mode - stop continuous animation
      isAnimationRunning.current = false;
  setAnimationModeSynced('step-by-step');
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Generate steps if not already generated
      if (algorithmSteps.length === 0) {
        const steps = generateSteps();
        if (steps.length > 0) {
          setAlgorithmSteps(steps);
          animationState.startAnimation(steps);
        }
      }
      addLog('Switched to step-by-step mode', 'info');
    } else {
  setAnimationModeSynced('continuous');
      addLog('Switched to continuous mode', 'info');
    }
  }, [isStepMode, algorithmSteps.length, generateSteps, animationState, addLog]);

  // Explicit mode setter for clearer UI control (continuous | step)
  const setMode = useCallback((mode) => {
    if (mode === 'step' && !isStepMode) {
      isAnimationRunning.current = false;
      setIsStepMode(true);
      setAnimationMode('step-by-step');
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (algorithmSteps.length === 0) {
        const steps = generateSteps();
        if (steps.length > 0) {
          setAlgorithmSteps(steps);
          animationState.startAnimation(steps);
        }
      }
      addLog('Mode: Step-by-step', 'info');
    } else if (mode === 'continuous' && isStepMode) {
      setIsStepMode(false);
      setAnimationMode('continuous');
      addLog('Mode: Continuous', 'info');
    }
  }, [isStepMode, algorithmSteps.length, generateSteps, animationState, addLog]);

  // Speed control
  const setSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
    addLog(`Playback speed set to ${speed}x`, 'info');
  }, [addLog]);

  const resetVisualization = useCallback(() => {
    // Stop any running animation first
    isAnimationRunning.current = false;
    justStartedRef.current = false;
  setAnimationModeSynced('continuous');
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Reset all state
    animationState.stopAnimation();
    animationState.resetAnimation();
    setAlgorithmSteps([]);
    setCurrentStepIndex(-1);
    setIsStepMode(false);
    resetData();
    addLog('Visualization reset', 'info');
  }, [animationState, resetData, addLog]);

  // Generate new algorithm steps
  const generateNewSteps = useCallback(() => {
    const steps = generateSteps();
    if (steps.length > 0) {
      setAlgorithmSteps(steps);
      setCurrentStepIndex(-1);
      animationState.startAnimation(steps);
      addLog('Generated new algorithm steps', 'info');
    }
  }, [generateSteps, animationState, addLog]);

  return {
    // Core animation controls
    runAnimation,
    resetVisualization,
    generateNewSteps,
    
    // Step-by-step controls
    nextStep,
    previousStep,
    goToStep,
    toggleStepMode,
  setMode,
    
    // Enhanced controls
    setSpeed,
    
    // State information
    algorithmSteps,
    currentStepIndex,
    isStepMode,
    animationMode,
    playbackSpeed,
    isAnimationRunning: isAnimationRunning.current,
    
    // Utility functions
  executeStep,
    generateSteps,
    
    // Available hash functions for hash table algorithms
    hashFunctions: Object.keys(hashFunctions)
  };
};