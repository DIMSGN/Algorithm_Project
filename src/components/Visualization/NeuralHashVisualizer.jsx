import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, Target, Zap, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

const NeuralHashVisualizer = ({ animationState }) => {
  // Extract step data from animation state
  const stepData = animationState.currentStepData || {};
  const hashTable = stepData.hashTable || animationState.hashTable || Array(7).fill(null).map(() => []);
  const tableSize = Array.isArray(hashTable) ? hashTable.length : 0;
  const isChaining = hashTable.some(bucket => Array.isArray(bucket));
  const hashInfo = stepData.currentHashStep || animationState.currentHashStep || null;
  const highlightedBucket = stepData.inserted !== undefined ? stepData.inserted : (hashInfo?.hash !== undefined ? hashInfo.hash : null);
  
  // Track animation states for neural visualization
  const [neuralState, setNeuralState] = useState({
    activeKey: null,
    activeNeuron: null,
    hashValue: null,
    tableIndex: null,
    collisionState: null,
    completed: false,
    showPredictionPrompt: false,
    predictionMade: false,
    userPrediction: null,
    correctAnswer: null
  });
  
  // Interactive prediction state
  const [predictionState, setPredictionState] = useState({
    showPrompt: false,
    question: '',
    options: [],
    userAnswer: null,
    correctAnswer: null,
    hasAnswered: false
  });

  // Update neural state when step changes
  useEffect(() => {
    if (!stepData) return;
    
    // Process the step data into neural visualization state
    const neuralUpdate = { completed: false };
    
    if (stepData.type === 'hash-computation') {
      neuralUpdate.activeKey = stepData.currentHashStep?.key;
      neuralUpdate.activeNeuron = 'input';
      neuralUpdate.hashValue = null;
      neuralUpdate.tableIndex = null;
      neuralUpdate.collisionState = null;
      
      // Show prediction prompt for hash computation
      setPredictionState({
        showPrompt: true,
        question: `What hash value will "${stepData.currentHashStep?.key}" produce?`,
        options: Array.from({length: 4}, () => Math.floor(Math.random() * tableSize)),
        correctAnswer: stepData.currentHashStep?.hash,
        userAnswer: null,
        hasAnswered: false
      });
    }
    else if (stepData.type === 'hash-result') {
      neuralUpdate.activeKey = stepData.currentHashStep?.key;
      neuralUpdate.activeNeuron = 'hash-function';
      neuralUpdate.hashValue = stepData.currentHashStep?.hash;
      neuralUpdate.tableIndex = null;
      
      // Show prediction prompt for table index
      setPredictionState({
        showPrompt: true,
        question: `The hash value is ${stepData.currentHashStep?.hash}. What table index will it map to with tableSize=${tableSize}?`,
        options: [
          stepData.currentHashStep?.hash % tableSize, 
          (stepData.currentHashStep?.hash + 1) % tableSize,
          (stepData.currentHashStep?.hash + 2) % tableSize,
          (stepData.currentHashStep?.hash + 3) % tableSize
        ].sort(() => Math.random() - 0.5),
        correctAnswer: stepData.currentHashStep?.hash % tableSize,
        userAnswer: null,
        hasAnswered: false
      });
    }
    else if (stepData.type === 'collision-detected' || stepData.type === 'collision-probe') {
      neuralUpdate.activeKey = stepData.currentHashStep?.key;
      neuralUpdate.activeNeuron = 'table-index';
      neuralUpdate.hashValue = stepData.currentHashStep?.hash;
      neuralUpdate.tableIndex = stepData.currentHashStep?.hash % tableSize;
      neuralUpdate.collisionState = 'detected';
      
      // Show prediction prompt for collision resolution
      const question = isChaining
        ? `Collision detected! How will chaining resolve this?`
        : `Collision detected at index ${neuralUpdate.tableIndex}! Where will open addressing probe next?`;
        
      const options = isChaining
        ? ['Add to linked list at same index', 'Try next index', 'Use a different hash function', 'Overflow to a separate area']
        : [`Index ${(neuralUpdate.tableIndex + 1) % tableSize}`, `Index ${(neuralUpdate.tableIndex + 2) % tableSize}`, 
           `Random empty slot`, `Use secondary hash function`];
           
      setPredictionState({
        showPrompt: true,
        question,
        options,
        correctAnswer: isChaining ? 'Add to linked list at same index' : `Index ${(neuralUpdate.tableIndex + 1) % tableSize}`,
        userAnswer: null,
        hasAnswered: false
      });
    }
    else if (stepData.type === 'insert-chaining' || stepData.type === 'insert-probing') {
      neuralUpdate.activeKey = stepData.key;
      neuralUpdate.activeNeuron = 'inserted';
      neuralUpdate.hashValue = stepData.currentHashStep?.hash;
      neuralUpdate.tableIndex = stepData.inserted;
      neuralUpdate.collisionState = stepData.highlight?.includes('collision') ? 'resolved' : null;
      neuralUpdate.completed = true;
      
      // Clear prediction prompt after insertion
      setPredictionState({
        showPrompt: false
      });
    }
    
    setNeuralState(prev => ({...prev, ...neuralUpdate}));
  }, [stepData, tableSize, isChaining]);

  // Statistics
  const totalElements = isChaining
    ? hashTable.reduce((sum, bucket) => sum + bucket.length, 0)
    : hashTable.filter(slot => slot && (slot.key || slot.value || typeof slot === 'string')).length;
  const loadFactor = tableSize > 0 ? (totalElements / tableSize).toFixed(2) : 0;
  const occupiedBuckets = isChaining ? hashTable.filter(b => b.length > 0).length : totalElements;
  const collisions = isChaining 
    ? hashTable.filter(b => b.length > 1).length 
    : stepData.type === 'insert-probing' && stepData.currentHashStep?.probeCount > 0 ? 1 : 0;

  // Handle user prediction answers
  const handlePredictionAnswer = (answer) => {
    const isCorrect = answer === predictionState.correctAnswer;
    
    setPredictionState(prev => ({
      ...prev,
      userAnswer: answer,
      hasAnswered: true
    }));
    
    // Add appropriate log message
    if (animationState.addLog) {
      animationState.addLog(
        isCorrect 
          ? `Correct! ${answer} is the right answer.` 
          : `Not quite. The correct answer is ${predictionState.correctAnswer}.`,
        isCorrect ? 'success' : 'warning'
      );
    }
  };

  // Color constants for neural path visualization
  const colors = {
    input: 'bg-gradient-to-r from-blue-500 to-blue-600',
    hashFunction: 'bg-gradient-to-r from-purple-500 to-purple-600',
    modulo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    tableIndex: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    collision: 'bg-gradient-to-r from-red-500 to-red-600',
    stored: 'bg-gradient-to-r from-green-500 to-green-600',
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Neural Hash Visualization</h2>
            <p className="text-sm text-gray-400">Table Size: {tableSize} | Load Factor: {loadFactor}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{totalElements}</div>
            <div className="text-slate-400">Elements</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{collisions}</div>
            <div className="text-slate-400">Collisions</div>
          </div>
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div className="space-y-4">
        {/* Hash Process Flow Visualization */}
        <div className="bg-slate-900/70 border border-blue-900/40 rounded-xl p-6 space-y-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Neural Hash Processing
          </h3>
          
          {/* Neural network visualization as a horizontal flow */}
          <div className="flex flex-col space-y-12">
            {/* Level 1: Input Key */}
            <div className="flex items-center justify-center gap-10">
              <div className="w-48 text-center">
                <div className="text-sm font-medium text-blue-300 mb-2">Input Key</div>
                <div className={`w-full h-16 rounded-lg flex items-center justify-center text-lg font-mono border-2 transition-all duration-500
                  ${neuralState.activeKey 
                    ? 'border-blue-500 text-white shadow-lg shadow-blue-500/20 ' + colors.input 
                    : 'border-slate-700 bg-slate-800/50 text-slate-500'
                  }`}
                >
                  {neuralState.activeKey || "key"}
                </div>
              </div>
              
              <div className={`w-16 h-1 transition-all duration-500 ${neuralState.activeNeuron ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
              
              <div className="w-48 text-center">
                <div className="text-sm font-medium text-purple-300 mb-2">Hash Function</div>
                <div className={`w-full h-16 rounded-lg flex items-center justify-center text-sm font-mono border-2 transition-all duration-500
                  ${neuralState.activeNeuron === 'hash-function' || neuralState.activeNeuron === 'table-index' || neuralState.activeNeuron === 'inserted'
                    ? 'border-purple-500 text-white shadow-lg shadow-purple-500/20 ' + colors.hashFunction
                    : 'border-slate-700 bg-slate-800/50 text-slate-500'
                  }`}
                >
                  {hashInfo?.function || "h(key)"}
                </div>
                
                {/* Hash computation result */}
                {neuralState.hashValue !== null && (
                  <div className="mt-2 bg-purple-900/30 rounded px-3 py-1 text-sm font-mono text-purple-300">
                    hash = {neuralState.hashValue}
                  </div>
                )}
              </div>
            </div>
            
            {/* Level 2: Modulo Operation */}
            <div className="flex items-center justify-center gap-10">
              <div className="w-48 text-center">
                <div className="text-sm font-medium text-indigo-300 mb-2">Modulo Operation</div>
                <div className={`w-full h-16 rounded-lg flex items-center justify-center text-sm font-mono border-2 transition-all duration-500
                  ${neuralState.activeNeuron === 'table-index' || neuralState.activeNeuron === 'inserted'
                    ? 'border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ' + colors.modulo
                    : 'border-slate-700 bg-slate-800/50 text-slate-500'
                  }`}
                >
                  hash % {tableSize}
                </div>
                
                {/* Modulo result */}
                {neuralState.tableIndex !== null && (
                  <div className="mt-2 bg-indigo-900/30 rounded px-3 py-1 text-sm font-mono text-indigo-300">
                    index = {neuralState.tableIndex}
                  </div>
                )}
              </div>
              
              <div className={`w-16 h-1 transition-all duration-500 ${neuralState.tableIndex !== null ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
              
              <div className="w-48 text-center">
                <div className="text-sm font-medium text-emerald-300 mb-2">Table Index</div>
                <div className={`w-full h-16 rounded-lg flex items-center justify-center text-lg font-mono border-2 transition-all duration-500
                  ${neuralState.activeNeuron === 'table-index' 
                    ? 'border-emerald-500 text-white shadow-lg shadow-emerald-500/20 ' + colors.tableIndex
                    : neuralState.activeNeuron === 'inserted'
                      ? 'border-green-500 text-white shadow-lg shadow-green-500/20 ' + colors.stored
                      : 'border-slate-700 bg-slate-800/50 text-slate-500'
                  }`}
                >
                  {neuralState.tableIndex !== null ? neuralState.tableIndex : "?"}
                </div>
              </div>
            </div>
            
            {/* Collision state if applicable */}
            {neuralState.collisionState && (
              <div className="flex justify-center">
                <div className={`rounded-lg p-3 font-medium text-center w-64 transition-all
                  ${neuralState.collisionState === 'detected' 
                    ? 'bg-red-900/30 border border-red-700 text-red-300'
                    : 'bg-green-900/30 border border-green-700 text-green-300'
                  }`}
                >
                  {neuralState.collisionState === 'detected' 
                    ? <div className="flex items-center gap-2 justify-center">
                        <AlertCircle size={16} />
                        <span>Collision Detected!</span>
                      </div>
                    : <div className="flex items-center gap-2 justify-center">
                        <CheckCircle2 size={16} />
                        <span>Collision Resolved</span>
                      </div>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Hash Table (Neural Grid) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            Neural Storage Grid
          </h3>
          
          <div className="grid grid-cols-7 gap-3">
            {hashTable.map((bucket, index) => {
              // Normalize bucket for probing mode
              const bucketItems = isChaining ? bucket : (hashTable[index] === null ? [] : [hashTable[index]]);
              const isHighlighted = highlightedBucket === index;
              const isEmpty = bucketItems.length === 0;
              const hasCollision = isChaining && bucketItems.length > 1;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Neuron (table slot) */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 transition-all
                    ${isHighlighted 
                      ? hasCollision
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 border-4 border-red-300 shadow-lg shadow-red-500/30'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 border-4 border-green-300 shadow-lg shadow-emerald-500/30'
                      : isEmpty
                        ? 'bg-gradient-to-r from-slate-600 to-slate-700 border-2 border-slate-500'
                        : hasCollision
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-amber-400'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-blue-400'
                    }`}
                  >
                    {index}
                  </div>
                  
                  {/* Bucket/chain contents */}
                  <div className="flex flex-col items-center gap-1 min-h-[60px]">
                    {bucketItems.map((item, itemIndex) => {
                      const keyValue = typeof item === 'object' ? item.key : item;
                      const isActive = keyValue === neuralState.activeKey;
                      
                      return (
                        <div key={itemIndex} 
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            hasCollision
                              ? itemIndex === 0 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                              : 'bg-gradient-to-r from-emerald-500 to-green-400 text-white'
                          } ${isActive ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-110' : ''}`}
                        >
                          {keyValue}
                        </div>
                      );
                    })}
                    
                    {isEmpty && (
                      <div className="text-xs text-slate-400 italic">empty</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Interactive Prediction Component */}
      {predictionState.showPrompt && (
        <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Target size={18} />
            </div>
            <h3 className="font-bold text-white">Predict what happens next:</h3>
          </div>
          
          <p className="text-slate-300 mb-3">{predictionState.question}</p>
          
          <div className="grid grid-cols-2 gap-3">
            {predictionState.options.map((option, i) => (
              <button
                key={i}
                className={`p-3 rounded-lg text-sm font-medium transition 
                  ${predictionState.hasAnswered
                    ? option === predictionState.correctAnswer
                      ? 'bg-green-600 text-white'
                      : option === predictionState.userAnswer
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    : 'bg-slate-700 hover:bg-blue-600 text-white'
                  }`}
                onClick={() => handlePredictionAnswer(option)}
                disabled={predictionState.hasAnswered}
              >
                {option}
              </button>
            ))}
          </div>
          
          {predictionState.hasAnswered && (
            <div className={`mt-3 p-3 rounded-lg text-sm
              ${predictionState.userAnswer === predictionState.correctAnswer
                ? 'bg-green-900/30 text-green-300'
                : 'bg-red-900/30 text-red-300'
              }`}
            >
              {predictionState.userAnswer === predictionState.correctAnswer
                ? '✓ Correct! That\'s exactly right.'
                : `✗ Not quite. The correct answer is: ${predictionState.correctAnswer}`
              }
            </div>
          )}
        </div>
      )}

      {/* Current Step Information */}
      {stepData.message && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div className="font-medium text-white mb-1">{stepData.message}</div>
          {stepData.highlight && (
            <div className="text-sm text-emerald-400">{stepData.highlight}</div>
          )}
          {stepData.description && (
            <div className="text-xs text-slate-400 mt-1">{stepData.description}</div>
          )}
        </div>
      )}

      {/* Empty / Instruction State */}
      {!animationState.steps.length && !stepData.type && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 text-center text-slate-300">
          <div className="text-lg font-semibold mb-2">No hash steps yet</div>
          <div className="text-sm mb-2">Use the controls to generate hash table steps.</div>
          <div className="text-xs text-slate-500">You'll see keys flowing through the neural hash network!</div>
        </div>
      )}
    </div>
  );
};

export default NeuralHashVisualizer;