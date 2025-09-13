import React, { createContext, useContext, useReducer } from 'react';

// Logging context for algorithm execution logs
const LogsContext = createContext();

const initialState = {
  logs: []
};

const logsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs.slice(-4), { // Keep only last 5 logs
          message: action.payload.message,
          type: action.payload.type || 'info',
          timestamp: Date.now()
        }]
      };
    case 'CLEAR_LOGS':
      return {
        ...state,
        logs: []
      };
    default:
      return state;
  }
};

export const LogsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(logsReducer, initialState);

  const addLog = (message, type = 'info') => {
    dispatch({ type: 'ADD_LOG', payload: { message, type } });
  };

  const clearLogs = () => {
    dispatch({ type: 'CLEAR_LOGS' });
  };

  const value = {
    ...state,
    addLog,
    clearLogs
  };

  return (
    <LogsContext.Provider value={value}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};