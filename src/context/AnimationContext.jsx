import React, { createContext, useContext, useReducer } from 'react';

// Animation state and control context
const AnimationContext = createContext();

const initialState = {
  isRunning: false,
  currentStep: 0,
  currentStepData: null,
  steps: [],
  speed: 1000,
  comparing: [],
  swapping: [],
  sorted: [],
  pivot: -1,
  searching: -1,
  found: -1,
  callStack: [],
  highlight: '',
  // Hash table specific
  hashTable: Array(10).fill(null).map(() => []),
  currentHashStep: null,
  // Recursion specific
  towers: [[], [], []],
  moveCount: 0,
  finalResult: null,
  fibTree: null
};

const animationReducer = (state, action) => {
  switch (action.type) {
    case 'START_ANIMATION':
      return {
        ...state,
        isRunning: true,
        steps: action.payload.steps,
        currentStep: 0
      };
    case 'STOP_ANIMATION':
      return {
        ...state,
        isRunning: false
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload.step,
        currentStepData: action.payload.stepData,
        comparing: action.payload.stepData.comparing || [],
        swapping: action.payload.stepData.swapping || [],
        sorted: action.payload.stepData.sorted || [],
        searching: action.payload.stepData.searching || -1,
        found: action.payload.stepData.found || -1,
        highlight: action.payload.stepData.highlight || '',
        // Hash table properties
        hashTable: action.payload.stepData.hashTable || state.hashTable,
        currentHashStep: action.payload.stepData.currentHashStep || null,
        // Recursion properties
        callStack: action.payload.stepData.callStack || [],
        towers: action.payload.stepData.towers || state.towers,
        moveCount: action.payload.stepData.moveCount || state.moveCount,
        finalResult: action.payload.stepData.finalResult || state.finalResult,
        fibTree: action.payload.stepData.fibTree || state.fibTree
      };
    case 'SET_SPEED':
      return {
        ...state,
        speed: action.payload
      };
    case 'RESET_ANIMATION':
      return {
        ...initialState,
        speed: state.speed, // Preserve speed setting
        hashTable: Array(10).fill(null).map(() => []), // Reset hash table
        towers: [[], [], []] // Reset towers
      };
    case 'UPDATE_STATE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export const AnimationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(animationReducer, initialState);

  const startAnimation = (steps) => {
    dispatch({ type: 'START_ANIMATION', payload: { steps } });
  };

  const stopAnimation = () => {
    dispatch({ type: 'STOP_ANIMATION' });
  };

  const setCurrentStep = (step, stepData) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: { step, stepData } });
  };

  const setSpeed = (speed) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  };

  const resetAnimation = () => {
    dispatch({ type: 'RESET_ANIMATION' });
  };

  const updateState = (newState) => {
    dispatch({ type: 'UPDATE_STATE', payload: newState });
  };

  const value = {
    ...state,
    startAnimation,
    stopAnimation,
    setCurrentStep,
    setSpeed,
    resetAnimation,
    updateState
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};