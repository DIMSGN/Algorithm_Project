import React, { createContext, useContext, useReducer } from 'react';

// Algorithm selection and configuration context
const AlgorithmContext = createContext();

const initialState = {
  selectedCategory: 'sorting',
  selectedAlgorithm: 'bubble-sort',
  data: [64, 34, 25, 12, 22, 11, 90],
  inputValue: '',
  hashTable: Array(10).fill(null).map(() => []),
  // Configuration for hashing algorithms (can be extended later)
  hashConfig: {
    tableSize: 7,
    hashFunction: 'modulo'
  }
};

const algorithmReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload.category,
        selectedAlgorithm: action.payload.defaultAlgorithm
      };
    case 'SET_ALGORITHM':
      return {
        ...state,
        selectedAlgorithm: action.payload
      };
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload
      };
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.payload
      };
    case 'SHUFFLE_DATA':
      return {
        ...state,
        data: [...state.data].sort(() => Math.random() - 0.5)
      };
    case 'RESET_DATA':
      return {
        ...state,
        data: [64, 34, 25, 12, 22, 11, 90],
        inputValue: ''
      };
    case 'UPDATE_HASH_TABLE':
      return {
        ...state,
        hashTable: action.payload
      };
    case 'SET_HASH_CONFIG':
      return {
        ...state,
        hashConfig: {
          ...state.hashConfig,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

export const AlgorithmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(algorithmReducer, initialState);

  const setCategory = (category, defaultAlgorithm) => {
    dispatch({ type: 'SET_CATEGORY', payload: { category, defaultAlgorithm } });
  };

  const setAlgorithm = (algorithm) => {
    dispatch({ type: 'SET_ALGORITHM', payload: algorithm });
  };

  const setData = (data) => {
    dispatch({ type: 'SET_DATA', payload: data });
  };

  const setInputValue = (value) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: value });
  };

  const shuffleData = () => {
    dispatch({ type: 'SHUFFLE_DATA' });
  };

  const resetData = () => {
    dispatch({ type: 'RESET_DATA' });
  };

  const updateHashTable = (hashTable) => {
    dispatch({ type: 'UPDATE_HASH_TABLE', payload: hashTable });
  };

  const setHashConfig = (config) => {
    dispatch({ type: 'SET_HASH_CONFIG', payload: config });
  };

  const value = {
    ...state,
    setCategory,
    setAlgorithm,
    setData,
    setInputValue,
    shuffleData,
    resetData,
    updateHashTable,
    setHashConfig
  };

  return (
    <AlgorithmContext.Provider value={value}>
      {children}
    </AlgorithmContext.Provider>
  );
};

export const useAlgorithm = () => {
  const context = useContext(AlgorithmContext);
  if (!context) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
};