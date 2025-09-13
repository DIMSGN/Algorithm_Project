import React, { useState, useEffect } from 'react';
import { modernHashFunctions, visualHashFunctions } from "../../algorithms/hashing";
import { Network, Hash, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const SAMPLE_KEYS = ["apple", "banana", "cat", "dog"];
const TABLE_SIZE = 8;
const HASH_FUNCTIONS = [
  { key: "sum", label: "Sum of Character Codes" },
  { key: "djb2", label: "DJB2 Hash" },
];

// Component for hash function performance comparison
const ModernHashFunctionComparison = () => {
  const [mode, setMode] = useState("chaining"); // "chaining" or "open"
  const [selectedKey, setSelectedKey] = useState(SAMPLE_KEYS[0]);
  const [selectedFunction, setSelectedFunction] = useState(HASH_FUNCTIONS[0].key);
  const [hashDetails, setHashDetails] = useState([]);
  const [processingStep, setProcessingStep] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);

  // Hash a single key to display the detailed steps
  const hashKey = (key) => {
    // Use the appropriate hash function based on selection
    const hashFunc = modernHashFunctions[selectedFunction] || visualHashFunctions[selectedFunction];
    if (!hashFunc) return null;
    
    // Get hash result with all the detailed steps
    const hashResult = hashFunc(key, TABLE_SIZE);
    
    // Build a visual representation of the table
    const table = Array(TABLE_SIZE).fill(null).map(() => mode === "chaining" ? [] : null);
    let index = hashResult.index;
    let collision = false;
    let placementIndex = index;
    let probeCount = 0;
    
    if (mode === "open") {
      // Linear probing for open addressing
      while (table[placementIndex] !== null) {
        collision = true;
        probeCount++;
        placementIndex = (placementIndex + 1) % TABLE_SIZE;
      }
      table[placementIndex] = key;
    } else {
      // Chaining
      if (table[placementIndex].length > 0) collision = true;
      table[placementIndex].push(key);
    }
    
    return {
      key,
      hash: hashResult.hash,
      originalIndex: index,
      placementIndex,
      collision,
      probeCount,
      steps: hashResult.steps,
      processSteps: hashResult.modernSteps || [],
      table
    };
  };

  // Hash all sample keys to build comparison
  const buildHashTable = (keys, fn) => {
    // Use the appropriate hash function
    const hashFunc = modernHashFunctions[fn] || visualHashFunctions[fn];
    if (!hashFunc) return [];
    
    // Create an empty table
    const table = Array(TABLE_SIZE).fill(null).map(() => mode === "chaining" ? [] : null);
    const results = [];
    
    // Insert each key into the table
    keys.forEach(key => {
      const hashResult = hashFunc(key, TABLE_SIZE);
      let index = hashResult.index;
      let collision = false;
      let placementIndex = index;
      let probeCount = 0;
      
      // Handle collisions based on the current mode
      if (mode === "open") {
        while (table[placementIndex] !== null) {
          collision = true;
          probeCount++;
          placementIndex = (placementIndex + 1) % TABLE_SIZE;
        }
        table[placementIndex] = key;
      } else {
        if (table[placementIndex].length > 0) collision = true;
        table[placementIndex].push(key);
      }
      
      // Store the result
      results.push({
        key,
        hash: hashResult.hash,
        originalIndex: index,
        placementIndex,
        collision,
        probeCount,
        steps: hashResult.steps,
        processSteps: hashResult.modernSteps,
        table: JSON.parse(JSON.stringify(table))
      });
    });
    
    return results;
  };

  // Compare all hash functions against all keys
  const compareFunctions = () => {
    return HASH_FUNCTIONS.map(fn => {
      return {
        name: fn.label,
        key: fn.key,
        results: buildHashTable(SAMPLE_KEYS, fn.key)
      };
    });
  };

  // Update when key, function or mode changes
  useEffect(() => {
    const result = hashKey(selectedKey);
    setHashDetails(result ? [result] : []);
    setProcessingStep(0);
  }, [selectedKey, selectedFunction, mode]);
  
  // Animation control
  useEffect(() => {
    let timer;
    if (animationRunning && hashDetails.length > 0) {
      const maxSteps = hashDetails[0].processSteps?.length || 0;
      if (maxSteps > 0 && processingStep < maxSteps - 1) {
        timer = setTimeout(() => {
          setProcessingStep(prev => prev + 1);
        }, 1000);
      } else {
        setAnimationRunning(false);
      }
    }
    return () => clearTimeout(timer);
  }, [animationRunning, processingStep, hashDetails]);

  // Get the current processing step details
  const getCurrentProcessStep = () => {
    if (hashDetails.length === 0 || !hashDetails[0].processSteps) return null;
    if (processingStep >= hashDetails[0].processSteps.length) return hashDetails[0].processSteps[hashDetails[0].processSteps.length - 1];
    return hashDetails[0].processSteps[processingStep];
  };
  
  const currentStep = getCurrentProcessStep();

  return (
    <div className="bg-slate-900 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Hash Function Analysis</h2>
          <p className="text-sm text-slate-400">Examine how different hash functions distribute keys across a table</p>
        </div>
        
        <div className="flex gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Collision Handling</label>
            <div className="flex gap-1">
              <button 
                onClick={() => setMode("chaining")}
                className={`px-3 py-1 text-sm rounded ${mode === "chaining" ? "bg-blue-700 text-white" : "bg-slate-700 text-blue-300"}`}
              >
                Chaining
              </button>
              <button 
                onClick={() => setMode("open")}
                className={`px-3 py-1 text-sm rounded ${mode === "open" ? "bg-green-700 text-white" : "bg-slate-700 text-green-300"}`}
              >
                Open Addressing
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Hash Function</label>
            <select 
              value={selectedFunction} 
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="bg-slate-800 text-white rounded px-3 py-1 text-sm border border-slate-700"
            >
              {HASH_FUNCTIONS.map(fn => (
                <option key={fn.key} value={fn.key}>{fn.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Sample Key</label>
            <select 
              value={selectedKey} 
              onChange={(e) => setSelectedKey(e.target.value)}
              className="bg-slate-800 text-white rounded px-3 py-1 text-sm border border-slate-700"
            >
              {SAMPLE_KEYS.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Detailed Hash Processing */}
      {hashDetails.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hash Steps Visualization */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center">
                <Hash size={16} className="mr-1 text-purple-500" />
                Hash Computation
              </h3>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setProcessingStep(p => Math.max(0, p - 1))}
                  disabled={processingStep === 0}
                  className="px-2 py-1 text-xs rounded bg-slate-700 text-white disabled:opacity-50"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setAnimationRunning(!animationRunning)}
                  className={`px-2 py-1 text-xs rounded ${animationRunning ? 'bg-red-700 text-white' : 'bg-blue-700 text-white'}`}
                >
                  {animationRunning ? 'Pause' : 'Play'}
                </button>
                <button 
                  onClick={() => setProcessingStep(p => p + 1)}
                  disabled={!hashDetails[0].processSteps || processingStep >= hashDetails[0].processSteps.length - 1}
                  className="px-2 py-1 text-xs rounded bg-slate-700 text-white disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
            
            {/* Processing Step Indicator */}
            {hashDetails[0].processSteps && (
              <div className="bg-slate-900 rounded p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Processing Phase</span>
                  <span className="text-xs text-blue-300 font-mono">
                    {processingStep + 1} / {hashDetails[0].processSteps.length}
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${((processingStep + 1) / hashDetails[0].processSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Current Processing Step */}
            {currentStep && (
              <div className={`border-l-4 pl-3 py-1 mb-4 transition-all duration-300
                ${currentStep.phase === 'input' ? 'border-blue-500' :
                  currentStep.phase === 'activation' || currentStep.phase === 'transformation' ? 'border-purple-500' :
                  currentStep.phase === 'aggregation' ? 'border-indigo-500' :
                  currentStep.phase === 'initialization' ? 'border-yellow-500' :
                  currentStep.phase === 'output' ? 'border-green-500' : 'border-slate-500'
                }
              `}>
                <div className="text-sm font-medium text-white mb-1">{currentStep.message}</div>
                <div className="text-xs text-slate-400">{currentStep.phase.toUpperCase()} PHASE</div>
              </div>
            )}
            
            {/* Details List */}
            <div className="space-y-1 mt-4 max-h-[200px] overflow-y-auto pr-2">
              {currentStep?.details?.map((detail, i) => (
                <div key={i} className="text-xs text-slate-300 bg-slate-850 py-1 px-2 rounded font-mono">
                  {detail}
                </div>
              ))}
            </div>
            
            {/* Hash Summary */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400">Key</div>
                  <div className="text-sm text-white font-mono">{hashDetails[0].key}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Hash Value</div>
                  <div className="text-sm text-white font-mono">{hashDetails[0].hash}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Table Index</div>
                  <div className="text-sm text-white font-mono">{hashDetails[0].originalIndex}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Final Placement</div>
                  <div className="text-sm text-white font-mono">
                    {hashDetails[0].placementIndex}
                    {hashDetails[0].collision && (
                      <span className="ml-2 text-xs bg-red-900 text-red-300 px-1.5 py-0.5 rounded">
                        Collision
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hash Table Visualization */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="font-bold text-white flex items-center mb-4">
              <Database size={16} className="mr-1 text-green-500" />
              Hash Table State
            </h3>
            
            <div className="grid grid-cols-4 gap-2">
              {hashDetails[0].table.map((cell, i) => {
                const isTarget = i === hashDetails[0].originalIndex;
                const isPlacement = i === hashDetails[0].placementIndex;
                
                return (
                  <div 
                    key={i} 
                    className={`p-2 rounded ${
                      isTarget && isPlacement ? 'bg-green-900/40 border border-green-700' : 
                      isTarget ? 'bg-yellow-900/40 border border-yellow-700' :
                      isPlacement ? 'bg-blue-900/40 border border-blue-700' :
                      'bg-slate-900 border border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono text-slate-400">#{i}</span>
                      {isTarget && (
                        <span className="text-xs bg-yellow-900/60 text-yellow-300 px-1 py-0.5 rounded">Target</span>
                      )}
                      {isPlacement && (
                        <span className="text-xs bg-blue-900/60 text-blue-300 px-1 py-0.5 rounded">Placed</span>
                      )}
                    </div>
                    
                    <div className="min-h-[40px] flex flex-col justify-center">
                      {mode === "chaining" ? (
                        Array.isArray(cell) && cell.length > 0 ? (
                          <div className="space-y-1">
                            {cell.map((item, j) => (
                              <div 
                                key={j} 
                                className={`text-xs font-mono py-1 px-2 rounded-sm
                                  ${item === hashDetails[0].key ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-300'}
                                `}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">empty</span>
                        )
                      ) : (
                        cell ? (
                          <div className={`text-xs font-mono py-1 px-2 rounded-sm
                            ${cell === hashDetails[0].key ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-300'}
                          `}>
                            {cell}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">empty</span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {hashDetails[0].collision && (
              <div className="mt-4 bg-red-900/20 border border-red-800 rounded p-3">
                <div className="flex items-center text-sm text-red-300 font-medium mb-1">
                  <AlertCircle size={16} className="mr-1.5 text-red-500" />
                  Collision Detected
                </div>
                <p className="text-xs text-red-200">
                  {mode === "chaining" 
                    ? `The key "${hashDetails[0].key}" hashed to index ${hashDetails[0].originalIndex}, which already contained other keys. It was added to the chain at that index.`
                    : `The key "${hashDetails[0].key}" hashed to index ${hashDetails[0].originalIndex}, which was already occupied. After ${hashDetails[0].probeCount} probe(s), it was placed at index ${hashDetails[0].placementIndex}.`
                  }
                </p>
              </div>
            )}
            
            {!hashDetails[0].collision && (
              <div className="mt-4 bg-green-900/20 border border-green-800 rounded p-3">
                <div className="flex items-center text-sm text-green-300 font-medium mb-1">
                  <CheckCircle size={16} className="mr-1.5 text-green-500" />
                  Perfect Placement
                </div>
                <p className="text-xs text-green-200">
                  The key "{hashDetails[0].key}" was placed directly at its target index {hashDetails[0].originalIndex} with no collision.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Function Comparison */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-white mb-4">Hash Function Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {compareFunctions().map(fnResult => (
            <div key={fnResult.key} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h4 className="font-bold text-white mb-3">{fnResult.name}</h4>
              
              {/* Hash Table Visual */}
              <div className="grid grid-cols-8 gap-1 mb-4">
                {fnResult.results[fnResult.results.length - 1].table.map((cell, i) => (
                  <div 
                    key={i}
                    className="aspect-square flex flex-col items-center justify-center rounded relative overflow-hidden"
                  >
                    {/* Index number */}
                    <div className="absolute top-0 left-0 w-full bg-slate-900/80 text-center">
                      <span className="text-[10px] text-slate-400">{i}</span>
                    </div>
                    
                    {/* Cell content */}
                    <div className={`w-full h-full flex items-center justify-center 
                      ${mode === "chaining" && Array.isArray(cell) && cell.length > 0 ? 
                        (cell.length === 1 ? 'bg-blue-800/40' : 
                         cell.length === 2 ? 'bg-yellow-800/40' :
                         cell.length >= 3 ? 'bg-red-800/40' : 'bg-slate-900') :
                        cell ? 'bg-blue-800/40' : 'bg-slate-900'
                      }
                    `}>
                      {mode === "chaining" && Array.isArray(cell) ? (
                        <span className="text-[10px] font-bold text-white">{cell.length}</span>
                      ) : (
                        cell && <span className="text-[10px] font-bold text-white">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="text-slate-400">Total Keys:</div>
                <div className="text-white font-mono">{SAMPLE_KEYS.length}</div>
                
                <div className="text-slate-400">Collisions:</div>
                <div className="text-white font-mono">
                  {fnResult.results.filter(r => r.collision).length}
                  {fnResult.results.filter(r => r.collision).length > 0 && (
                    <span className="ml-1 text-red-400">
                      ({Math.round((fnResult.results.filter(r => r.collision).length / SAMPLE_KEYS.length) * 100)}%)
                    </span>
                  )}
                </div>
                
                {mode === "open" && (
                  <>
                    <div className="text-slate-400">Avg. Probes:</div>
                    <div className="text-white font-mono">
                      {(fnResult.results.reduce((acc, r) => acc + r.probeCount, 0) / SAMPLE_KEYS.length).toFixed(2)}
                    </div>
                  </>
                )}
                
                {mode === "chaining" && (
                  <>
                    <div className="text-slate-400">Max Chain Length:</div>
                    <div className="text-white font-mono">
                      {Math.max(...fnResult.results[fnResult.results.length - 1].table.map(cell => Array.isArray(cell) ? cell.length : 0))}
                    </div>
                  </>
                )}
                
                <div className="text-slate-400">Load Factor:</div>
                <div className="text-white font-mono">
                  {(SAMPLE_KEYS.length / TABLE_SIZE).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Educational Info */}
      <div className="mt-4 bg-slate-800/50 rounded-lg p-4 text-sm text-slate-300">
        <h4 className="font-bold mb-2">Understanding Hash Tables</h4>
        <p className="mb-2">Hash tables provide fast data retrieval by converting keys to array indices using hash functions. The ideal hash function distributes values evenly across the table to minimize collisions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <h5 className="font-bold text-white text-sm mb-1">Chaining</h5>
            <p className="text-xs">Handles collisions by creating a linked structure at each index. Multiple keys can be stored at the same array position. Performs well even with high load factors but requires extra memory for links.</p>
          </div>
          <div>
            <h5 className="font-bold text-white text-sm mb-1">Open Addressing</h5>
            <p className="text-xs">Handles collisions by finding another empty slot in the array using a probing sequence. All entries are stored in the array itself. More space-efficient but performance degrades as the table fills up.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHashFunctionComparison;