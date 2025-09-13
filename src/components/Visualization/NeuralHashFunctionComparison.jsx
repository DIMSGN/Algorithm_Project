import React, { useState, useEffect } from 'react';
import { neuralHashFunctions, visualHashFunctions } from "../../algorithms/hashing";
import { Network, Hash, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const SAMPLE_KEYS = ["apple", "banana", "cat", "dog"];
const TABLE_SIZE = 8;
const HASH_FUNCTIONS = [
  { key: "sum", label: "Sum of Character Codes" },
  { key: "djb2", label: "DJB2 Hash" },
];

// Color palette for network visualization
const COLORS = {
  input: 'bg-blue-500',
  process: 'bg-purple-500',
  output: 'bg-green-500',
  collision: 'bg-red-500',
  slot: 'bg-slate-700',
  empty: 'bg-slate-800',
  text: {
    input: 'text-blue-300',
    process: 'text-purple-300',
    output: 'text-green-300',
    collision: 'text-red-300',
  }
};

function buildHashTable(keys, hashFunc, tableSize, mode) {
  // mode: "chaining" or "open"
  const table = Array(tableSize).fill(null).map(() => mode === "chaining" ? [] : null);
  const steps = [];
  const allComputations = [];
  
  keys.forEach((key, i) => {
    // Use hash functions for visualization
    const hashResult = hashFunc(key, tableSize);
    const hash = hashResult.hash;
    const index = hashResult.index;
    let collision = false;
    let placementIndex = index;
    let probeCount = 0;
    
    // Store computation details
    const computation = {
      key,
      hash,
      index,
      processSteps: hashResult.neuralSteps || [],
      steps: hashResult.steps || []
    };
    
    if (mode === "open") {
      // Linear probing
      while (table[placementIndex] !== null) {
        collision = true;
        probeCount++;
        placementIndex = (placementIndex + 1) % tableSize;
        
        // Add probing info to computation
        computation.probeSequence = computation.probeSequence || [];
        computation.probeSequence.push(placementIndex);
      }
      table[placementIndex] = key;
      computation.finalIndex = placementIndex;
      computation.probeCount = probeCount;
    } else {
      // Chaining
      if (table[placementIndex].length > 0) {
        collision = true;
      }
      table[placementIndex].push(key);
      computation.finalIndex = placementIndex;
      computation.chainPosition = table[placementIndex].length - 1;
    }
    
    computation.collision = collision;
    allComputations.push(computation);
    
    steps.push({
      key,
      hash,
      index,
      placementIndex,
      collision,
      probeCount,
      hashSteps: hashResult.steps,
      processSteps: hashResult.neuralSteps,
      table: JSON.parse(JSON.stringify(table)),
    });
  });
  
  return {
    steps,
    table,
    computations: allComputations
  };
}

export default function NetworkHashVisualization() {
  const [mode, setMode] = useState("chaining");
  const [step, setStep] = useState(0);
  const [showSimulation, setShowSimulation] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  
  // Build results for each hash function - using try/catch to handle potential errors
  const hashResults = HASH_FUNCTIONS.map(fn => {
    try {
      return buildHashTable(SAMPLE_KEYS, neuralHashFunctions[fn.key] || visualHashFunctions[fn.key], TABLE_SIZE, mode);
    } catch (error) {
      console.error(`Error processing hash function ${fn.key}:`, error);
      // Return a minimal valid structure to avoid crashing
      return {
        steps: [{
          table: Array(TABLE_SIZE).fill(null).map(() => mode === "chaining" ? [] : null),
          key: null, 
          hash: 0,
          index: 0
        }],
        table: Array(TABLE_SIZE).fill(null).map(() => mode === "chaining" ? [] : null),
        computations: []
      };
    }
  });
  
  const maxSteps = Math.max(...hashResults.map(result => result.steps.length));

  // Step navigation
  const handleStep = dir => {
    setStep(s => Math.max(0, Math.min(maxSteps - 1, s + dir)));
  };
  
  // Run automatic simulation
  useEffect(() => {
    if (showSimulation) {
      const interval = setInterval(() => {
        setActiveKey(prev => {
          if (prev === null) return SAMPLE_KEYS[0];
          const idx = SAMPLE_KEYS.indexOf(prev);
          return idx < SAMPLE_KEYS.length - 1 ? SAMPLE_KEYS[idx + 1] : null;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [showSimulation]);
  
  // Processing animation
  useEffect(() => {
    if (activeKey) {
      // Animate through processing phases
      let phaseIndex = 0;
      const phaseInterval = setInterval(() => {
        if (phaseIndex < 4) { // input -> activation -> aggregation -> output
          setActivePhase(['input', 'activation', 'aggregation', 'output'][phaseIndex]);
          phaseIndex++;
        } else {
          setActivePhase(null);
          clearInterval(phaseInterval);
        }
      }, 800);
      
      return () => clearInterval(phaseInterval);
    }
  }, [activeKey]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Network size={24} className="text-blue-400" />
              Hash Function Comparison
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSimulation(!showSimulation)}
              className={`px-4 py-2 rounded font-medium ${showSimulation ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
              {showSimulation ? 'Stop Simulation' : 'Run Simulation'}
            </button>
            <button onClick={() => setMode("chaining")}
              className={`px-4 py-2 rounded font-medium ${mode === "chaining" ? 'bg-blue-700 text-white' : 'bg-slate-700 text-blue-300'}`}>
              Chaining
            </button>
            <button onClick={() => setMode("open")}
              className={`px-4 py-2 rounded font-medium ${mode === "open" ? 'bg-green-700 text-white' : 'bg-slate-700 text-green-300'}`}>
              Open Addressing
            </button>
          </div>
        </div>
        
        {/* Network Animation */}
        <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 my-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Network size={20} className="text-blue-400" />
            Hash Process Visualization
          </h3>
          
          <div className="flex flex-col items-center justify-center space-y-10">
            {/* Input Layer */}
            <div className="flex items-center gap-6">
              {SAMPLE_KEYS.map(key => (
                <div key={key} className={`transition-all duration-300 p-4 rounded-lg border-2 text-center min-w-[80px] ${
                  key === activeKey 
                    ? 'border-blue-400 bg-blue-900/30 text-white scale-110 shadow-lg shadow-blue-500/20'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400'
                }`}>
                  <div className="text-xs text-slate-400 mb-1">Input Key</div>
                  <div className="font-mono font-bold">{key}</div>
                </div>
              ))}
            </div>
            
            {/* Connection lines */}
            <div className="w-full flex justify-center">
              <div className={`h-10 w-1 ${activePhase === 'input' ? COLORS.input : 'bg-slate-700'}`}></div>
            </div>
            
            {/* Hash Function Layer */}
            <div className="w-full max-w-md bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-center text-sm text-purple-300 mb-2">Hash Function</div>
              <div className={`transition-all duration-300 rounded-lg p-3 text-sm font-mono border ${
                activePhase === 'activation' 
                  ? 'border-purple-400 bg-purple-900/30 text-white'
                  : 'border-slate-600 text-slate-400'
              }`}>
                {activeKey && activePhase === 'activation' ? (
                  <div>
                    <div className="text-xs text-purple-400 mb-1">Character Processing</div>
                    {[...activeKey].map((char, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>'{char}'</span>
                        <span className="text-purple-300">→</span>
                        <span>{char.charCodeAt(0)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">h(key) = process(key) % tableSize</div>
                )}
              </div>
            </div>
            
            {/* Connection lines */}
            <div className="w-full flex justify-center">
              <div className={`h-10 w-1 ${activePhase === 'aggregation' ? COLORS.process : 'bg-slate-700'}`}></div>
            </div>
            
            {/* Hash Value Layer */}
            <div className="flex items-center gap-2">
              <div className={`transition-all duration-300 w-32 p-3 rounded-lg border text-center ${
                activePhase === 'aggregation'
                  ? 'border-indigo-400 bg-indigo-900/30 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400'
              }`}>
                <div className="text-xs text-slate-400 mb-1">Hash Value</div>
                <div className="font-mono font-bold text-lg">
                  {activeKey && activePhase === 'aggregation' ? (
                    [...activeKey].reduce((sum, char) => sum + char.charCodeAt(0), 0)
                  ) : '?'}
                </div>
              </div>
              
              <ArrowRight size={20} className={activePhase === 'aggregation' ? 'text-indigo-400' : 'text-slate-600'} />
              
              <div className={`transition-all duration-300 w-32 p-3 rounded-lg border text-center ${
                activePhase === 'aggregation'
                  ? 'border-indigo-400 bg-indigo-900/30 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400'
              }`}>
                <div className="text-xs text-slate-400 mb-1">Modulo {TABLE_SIZE}</div>
                <div className="font-mono font-bold text-lg">
                  {activeKey && activePhase === 'aggregation' ? (
                    [...activeKey].reduce((sum, char) => sum + char.charCodeAt(0), 0) % TABLE_SIZE
                  ) : '?'}
                </div>
              </div>
            </div>
            
            {/* Connection lines */}
            <div className="w-full flex justify-center">
              <div className={`h-10 w-1 ${activePhase === 'output' ? COLORS.output : 'bg-slate-700'}`}></div>
            </div>
            
            {/* Hash Table (Storage) */}
            <div className="w-full">
              <div className="text-center text-sm text-green-300 mb-2">Hash Table Slots</div>
              <div className="grid grid-cols-8 gap-3">
                {Array(TABLE_SIZE).fill(0).map((_, i) => {
                  const isTargetSlot = activeKey && activePhase === 'output' && 
                    ([...activeKey].reduce((sum, char) => sum + char.charCodeAt(0), 0) % TABLE_SIZE === i);
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`transition-all duration-300 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isTargetSlot 
                          ? 'border-green-400 bg-green-900/40 text-white scale-110 shadow-lg shadow-green-500/20'
                          : 'border-slate-600 bg-slate-800/50 text-slate-400'
                      }`}>
                        {i}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hash Function Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {HASH_FUNCTIONS.map((fn, idx) => {
            const result = hashResults[idx];
            const current = result.steps[Math.min(step, result.steps.length - 1)] || result.steps[0];
            
            return (
              <div key={fn.key} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Hash size={18} className="text-blue-400" />
                  <h3 className="text-lg font-bold text-white">{fn.label}</h3>
                </div>
                
                {/* Hash Distribution Visualization */}
                <div className="grid grid-cols-8 gap-2 mb-6">
                  {current.table.map((bucket, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-slate-600 bg-slate-700">
                        {i}
                      </div>
                      <div className="flex flex-col items-center mt-2 min-h-[60px]">
                        {mode === "chaining" ? (
                          bucket.map((k, j) => (
                            <div key={j} 
                              className={`px-2 py-1 rounded-full text-xs font-mono mb-1 ${
                                bucket.length > 1 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                              }`}
                            >
                              {k}
                            </div>
                          ))
                        ) : (
                          bucket && (
                            <div className="px-2 py-1 rounded-full text-xs font-mono bg-green-500 text-white">
                              {bucket}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-300">Collisions</div>
                    <div className="text-lg font-bold text-red-400">
                      {result.computations.filter(c => c.collision).length}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-300">Distribution</div>
                    <div className="text-lg font-bold text-blue-400">
                      {mode === "chaining"
                        ? (result.computations.filter(c => !c.collision).length / SAMPLE_KEYS.length * 100).toFixed(0) + '%'
                        : (new Set(result.computations.map(c => c.index)).size / SAMPLE_KEYS.length * 100).toFixed(0) + '%'
                      }
                    </div>
                  </div>
                </div>
                
                {/* How It Works */}
                <div className="bg-slate-900/50 rounded-lg p-3 text-xs text-slate-300 space-y-2">
                  <div className="font-medium text-white">How this hash function works:</div>
                  <div>
                    {fn.key === "sum" && "Adds ASCII values of each character, then takes modulo of tableSize"}
                    {fn.key === "djb2" && "Multiplies by 33 and adds each character code for better avalanche effect"}
                  </div>
                  {result.computations.filter(c => c.collision).length > 0 && (
                    <div className="flex items-center gap-1 text-red-300">
                      <AlertCircle size={12} />
                      <span>Has collisions - keys map to same index</span>
                    </div>
                  )}
                  {mode === "open" && result.computations.some(c => c.probeCount > 0) && (
                    <div className="text-yellow-300">
                      Max probe count: {Math.max(...result.computations.map(c => c.probeCount || 0))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Interactive learning section */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Interactive Learning: Predict the Output</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700">
            <div className="text-white font-medium mb-2">Challenge 1: Hash Calculation</div>
            <div className="text-sm text-slate-300">What will be the hash value of "zebra" using the sum of ASCII values?</div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">222</button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">418</button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">530</button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">602</button>
            </div>
          </div>
          
          <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700">
            <div className="text-white font-medium mb-2">Challenge 2: Collision Prediction</div>
            <div className="text-sm text-slate-300">Which pair of words will cause a collision in an 8-slot hash table?</div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">cat, dog</button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">bat, hat</button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">art, cart</button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-sm rounded">bake, cake</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}