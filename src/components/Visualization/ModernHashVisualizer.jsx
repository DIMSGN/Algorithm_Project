import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, Target, Zap, Database, AlertCircle, CheckCircle2, Network, Hash } from 'lucide-react';

const ModernHashVisualizer = ({ animationState }) => {
  // Extract step data from animation state
  const stepData = animationState.currentStepData || {};
  const hashTable = stepData.hashTable || animationState.hashTable || Array(7).fill(null).map(() => []);
  const tableSize = Array.isArray(hashTable) ? hashTable.length : 0;
  const isChaining = hashTable.some(bucket => Array.isArray(bucket));
  const hashInfo = stepData.currentHashStep || animationState.currentHashStep || null;
  
  // Track animation states for modern visualization
  const [modernState, setModernState] = useState({
    activeKey: null,
    activeNeuron: null, // 'input', 'hash-function', 'table-index', or 'inserted'
    hashValue: null,
    tableIndex: null,
    collisionState: null, // 'detected' or 'resolved'
    completed: false
  });

  // Educational prompt states
  const [prompt, setPrompt] = useState({
    visible: false,
    question: '',
    options: [],
    correctAnswer: '',
    userAnswer: null,
    feedback: ''
  });

  // Update modern state when step changes
  useEffect(() => {
    if (!stepData) return;

    // Process the step data into modern visualization state
    const modernUpdate = { completed: false };

    if (stepData.type === 'input' || stepData.type === 'initialize') {
      modernUpdate.activeKey = stepData.currentHashStep?.key;
      modernUpdate.activeNeuron = 'input';
      modernUpdate.hashValue = null;
      modernUpdate.tableIndex = null;
      modernUpdate.collisionState = null;
    } 
    else if (stepData.type === 'modern-processing') {
      // If we're in a processing step, handle based on the phase
      const processingPhase = stepData.phase || '';
      
      if (processingPhase === 'activation' || processingPhase === 'transformation') {
        modernUpdate.activeKey = stepData.currentHashStep?.key;
        modernUpdate.activeNeuron = 'hash-function';
        modernUpdate.hashValue = stepData.currentHashStep?.hash;
        modernUpdate.tableIndex = null;
        modernUpdate.collisionState = null;
      } 
      else if (processingPhase === 'output' || processingPhase === 'aggregation') {
        modernUpdate.activeKey = stepData.currentHashStep?.key;
        modernUpdate.activeNeuron = 'table-index';
        modernUpdate.hashValue = stepData.currentHashStep?.hash;
        modernUpdate.tableIndex = stepData.currentHashStep?.hash % tableSize;
        modernUpdate.collisionState = 'detected';
        
        // Show an educational prompt for understanding collision resolution
        const newQuestion = isChaining 
          ? 'What happens when two keys hash to the same index in a hash table using chaining?' 
          : `Collision detected at index ${modernUpdate.tableIndex}! Where will open addressing probe next?`;
          
        const newOptions = isChaining
          ? ['Create a new hash table', 'Add to linked list at same index', 'Replace the existing value', 'Try a different hash function']
          : [`Index ${(modernUpdate.tableIndex + 1) % tableSize}`, `Index ${(modernUpdate.tableIndex + 2) % tableSize}`, 
             'Return an error', 'Create a new table'];
          
        setPrompt({
          visible: true,
          question: newQuestion,
          options: newOptions,
          correctAnswer: isChaining ? 'Add to linked list at same index' : `Index ${(modernUpdate.tableIndex + 1) % tableSize}`,
          userAnswer: null,
          feedback: ''
        });
      }
    }
    else if (stepData.type === 'insert') {
      modernUpdate.activeKey = stepData.key;
      modernUpdate.activeNeuron = 'inserted';
      modernUpdate.hashValue = stepData.currentHashStep?.hash;
      modernUpdate.tableIndex = stepData.inserted;
      modernUpdate.collisionState = stepData.highlight?.includes('collision') ? 'resolved' : null;
      modernUpdate.completed = true;
      
      // Reset prompt after insertion
      setPrompt(p => ({ ...p, visible: false }));
    }
    
    setModernState(prev => ({...prev, ...modernUpdate}));
  }, [stepData, tableSize, isChaining]);
  
  const handlePromptAnswer = (answer) => {
    const isCorrect = answer === prompt.correctAnswer;
    setPrompt(prev => ({
      ...prev,
      userAnswer: answer,
      feedback: isCorrect 
        ? 'Correct! That\'s how hash tables handle collisions.' 
        : `Not quite. The correct answer is: ${prompt.correctAnswer}`
    }));
    
    // Hide prompt after feedback
    setTimeout(() => {
      setPrompt(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Color constants for modern path visualization
  const nodeColors = {
    input: "bg-blue-500",
    hashFunction: "bg-purple-500", 
    tableIndex: "bg-green-500",
    inserted: "bg-yellow-500"
  };

  const edgeColors = {
    default: "bg-slate-700",
    active1: "bg-blue-500",
    active2: "bg-purple-500",
    active3: "bg-green-500"
  };
  
  // If there's no step data yet, show a placeholder
  if (!animationState || !animationState.hashTable) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Database className="mx-auto mb-4 w-12 h-12 opacity-50" />
          <p>Select an algorithm and input to begin visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Modern Hash Visualization</h2>
        </div>
        {stepData.type && (
          <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
            Step type: {stepData.type}
            {stepData.phase && <span className="ml-1 text-blue-300">/ {stepData.phase}</span>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modern Network Visualization */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center mb-4">
            <Network className="mr-2 text-blue-500" size={16} />
            <h3 className="font-bold text-white">
            Modern Hash Processing
            </h3>
          </div>
          <div className="my-8">
            {/* Modern network visualization as a horizontal flow */}
            <div className="flex items-center justify-between">
              {/* Input Node */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 
                  ${modernState.activeKey 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                    : 'bg-slate-700'
                  }`}>
                  <span className="text-white font-mono font-bold">
                    {modernState.activeKey || "key"}
                  </span>
                </div>
              </div>
              
              <div className={`w-16 h-1 transition-all duration-500 ${modernState.activeNeuron ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
              
              {/* Hash Function Node */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 
                  ${modernState.activeNeuron === 'hash-function' || modernState.activeNeuron === 'table-index' || modernState.activeNeuron === 'inserted'
                    ? 'bg-purple-500 shadow-lg shadow-purple-500/50' 
                    : 'bg-slate-700'
                  }`}>
                  <Hash className="text-white" size={32} />
                </div>
                
                {modernState.hashValue !== null && (
                  <div className="mt-2 px-2 py-1 bg-slate-900 rounded text-xs text-purple-300 font-mono">
                    hash = {modernState.hashValue}
                  </div>
                )}
              </div>
              
              <div className={`w-16 h-1 transition-all duration-500 ${modernState.activeNeuron === 'hash-function' ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
              
              {/* Index Mapping Node */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 
                  ${modernState.activeNeuron === 'table-index' || modernState.activeNeuron === 'inserted'
                    ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                    : 'bg-slate-700'
                  }`}>
                  <Target className="text-white" size={32} />
                </div>
                
                {modernState.tableIndex !== null && (
                  <div className="mt-2 px-2 py-1 bg-slate-900 rounded text-xs text-green-300 font-mono">
                    index = {modernState.tableIndex}
                  </div>
                )}
              </div>
              
              <div className={`w-16 h-1 transition-all duration-500 ${modernState.tableIndex !== null ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
              
              {/* Storage Node */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 
                  ${modernState.activeNeuron === 'table-index' 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                    : modernState.activeNeuron === 'inserted'
                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                    : 'bg-slate-700'
                  }`}>
                  <span className="text-white font-mono font-bold text-lg">
                    {modernState.tableIndex !== null ? modernState.tableIndex : "?"}
                  </span>
                </div>
              </div>
            </div>
            
            {modernState.collisionState && (
              <div className={`mt-4 p-3 rounded-lg border text-sm transition-all duration-500
                  ${modernState.collisionState === 'detected' 
                    ? 'bg-red-900/30 border-red-700 text-red-300' 
                    : 'bg-green-900/30 border-green-700 text-green-300'
                  }`}>
                  {modernState.collisionState === 'detected' 
                    ? <div className="flex items-center"><AlertCircle size={16} className="mr-2 text-red-500" /> Collision detected</div>
                    : <div className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-green-500" /> Collision resolved</div>
                  }
              </div>
            )}
            
            {prompt.visible && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
                <p className="text-sm text-blue-200 mb-2">{prompt.question}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {prompt.options.map((option, i) => (
                    <button 
                      key={i}
                      onClick={() => handlePromptAnswer(option)}
                      className={`px-2 py-1 text-xs rounded-md
                        ${prompt.userAnswer === option 
                          ? (option === prompt.correctAnswer ? 'bg-green-600 text-white' : 'bg-red-600 text-white')
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                        }`}>
                      {option}
                    </button>
                  ))}
                </div>
                {prompt.feedback && (
                  <p className="text-xs mt-2 text-white">{prompt.feedback}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Hash Table (Modern Grid) */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center mb-4">
            <Database className="mr-2 text-green-500" size={16} />
            <h3 className="font-bold text-white">
              Modern Storage Grid
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mt-4">
            {hashTable.map((bucket, index) => {
              const isActive = modernState.tableIndex === index;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center border-l-4 transition-all duration-300
                    ${isActive && modernState.activeNeuron === 'table-index' ? 'border-l-red-500' :
                      isActive && modernState.activeNeuron === 'inserted' ? 'border-l-green-500' : 
                      'border-l-slate-700'
                    }
                  `}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-md mr-2
                    ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-700 text-slate-300'}
                  `}>
                    <span className="text-xs font-mono">{index}</span>
                  </div>
                  
                  <div className="flex-1 min-h-[40px] bg-slate-900 rounded-md p-2 flex gap-1 flex-wrap items-center">
                    {isChaining ? (
                      Array.isArray(bucket) && bucket.length > 0 ? (
                        bucket.map((keyValue, keyIndex) => {
                          const isActive = keyValue === modernState.activeKey;
                          return (
                            <div key={keyIndex} className={`px-2 py-1 rounded-md text-xs font-mono flex items-center
                              ${isActive && modernState.activeNeuron === 'inserted' 
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/40' 
                                : 'bg-slate-700 text-slate-300'
                              }
                            `}>
                              {keyValue.toString()}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-500">empty</span>
                      )
                    ) : (
                      bucket ? (
                        <div className={`px-2 py-1 rounded-md text-xs font-mono 
                          ${bucket === modernState.activeKey && modernState.activeNeuron === 'inserted'
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-700 text-slate-300'
                          }
                        `}>
                          {bucket.toString()}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">empty</span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Show step message if available */}
          {stepData.message && (
            <div className="mt-4 px-3 py-2 bg-slate-900 rounded-lg text-sm text-slate-300">
              {stepData.message}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-4 mt-6 text-xs text-slate-400">
        {!stepData.message && !animationState.isRunning && (
          <div className="text-xs text-slate-500">You'll see keys flowing through the modern hash network!</div>
        )}
        {stepData.description && (
          <p>{stepData.description}</p>
        )}
      </div>
    </div>
  );
};

export default ModernHashVisualizer;