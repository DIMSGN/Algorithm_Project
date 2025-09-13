import React, { useState, useMemo } from 'react';

const RecursionVisualizer = ({ animationState, selectedAlgorithm, inputValue }) => {
  console.log('RecursionVisualizer render:', {
    selectedAlgorithm,
    inputValue,
    isRunning: animationState.isRunning,
    currentStep: animationState.currentStep,
    callStack: animationState.callStack
  });
  
  const [showHelp, setShowHelp] = useState(false);

  // Current step data convenience
  const currentStepData = animationState.currentStepData || {};

  const factorialChain = useMemo(() => {
    if (selectedAlgorithm !== 'factorial') return null;
    const steps = animationState.steps || [];
    // Collect return steps to build chain
    const returns = steps.filter(s => s.type === 'return').map(s => s.result);
    if (returns.length === 0) return null;
    const n = parseInt(inputValue);
    if (isNaN(n)) return null;
    const factors = Array.from({ length: n }, (_, i) => n - i);
    return factors.join(' × ');
  }, [animationState.steps, selectedAlgorithm, inputValue]);

  const fibonacciMemo = useMemo(() => {
    if (selectedAlgorithm !== 'fibonacci') return null;
    return currentStepData.memoSnapshot || null;
  }, [currentStepData, selectedAlgorithm]);

  const recentHanoiMoves = useMemo(() => {
    if (selectedAlgorithm !== 'tower-hanoi') return [];
    return (animationState.steps || [])
      .filter(s => s.type === 'move')
      .slice(-10);
  }, [animationState.steps, selectedAlgorithm]);

  const renderFactorialVisualization = () => (
    <div className="space-y-6">
      {/* Call Stack Visualization */}
      <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-bold text-white mb-4">📚 Call Stack</h3>
        <div className="space-y-2">
          {(animationState.callStack || []).map((call, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                index === (animationState.callStack?.length || 0) - 1
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400'
                  : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400'
              }`}
            >
              <div className="text-white font-mono">
                factorial({call.n !== undefined ? call.n : call.value}) {call.result !== undefined && `= ${call.result}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formula */}
      <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-bold text-white mb-4">🧮 Formula</h3>
        <div className="text-center space-y-2">
          <div className="text-2xl text-cyan-400 font-mono">
            n! = n × (n-1)!
          </div>
          <div className="text-gray-300">
            Base case: 0! = 1, 1! = 1
          </div>
          {inputValue && (
            <div className="text-yellow-400 font-bold text-xl">
              {inputValue}! = {animationState.finalResult || '?'}
            </div>
          )}
          {factorialChain && (
            <div className="text-sm text-purple-300 font-mono mt-2">
              {inputValue}! expansion: {factorialChain}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFibonacciVisualization = () => (
    <div className="space-y-6">
      {/* Fibonacci Tree */}
      <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-bold text-white mb-4">🌳 Recursion Tree</h3>
        <div className="text-center">
          <div className="text-gray-300 mb-4">
            Each fib(n) branches into fib(n-1) + fib(n-2)
          </div>
          {animationState.fibTree && (
            <div className="font-mono text-sm text-cyan-400">
              {/* Simple tree representation */}
              <div>fib({inputValue})</div>
              <div className="ml-4">├── fib({inputValue - 1})</div>
              <div className="ml-4">└── fib({inputValue - 2})</div>
            </div>
          )}
        </div>
      </div>

      {/* Call Stack */}
      <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-bold text-white mb-4">📚 Active Calls</h3>
        <div className="space-y-2">
          {(animationState.callStack || []).map((call, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                index === (animationState.callStack?.length || 0) - 1
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400'
                  : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400'
              }`}
            >
              <div className="text-white font-mono">
                fib({call.n !== undefined ? call.n : call.value}) {call.result !== undefined && `= ${call.result}`}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Memoization Table */}
      {fibonacciMemo && (
        <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
          <h3 className="text-lg font-bold text-white mb-4">🗂️ Memo Cache</h3>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {Object.keys(fibonacciMemo).sort((a,b)=>parseInt(a)-parseInt(b)).map(k => (
              <div key={k} className="bg-slate-700/60 rounded p-2 text-cyan-300 border border-slate-500/50">
                fib({k}) = {fibonacciMemo[k]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTowerOfHanoiVisualization = () => {
    const numDisks = parseInt(inputValue) || 3;
    
    return (
      <div className="space-y-6">
        {/* Tower Visualization */}
        <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
          <h3 className="text-lg font-bold text-white mb-4">🗼 Tower of Hanoi</h3>
          <div className="flex justify-around items-end h-64">
            {['A', 'B', 'C'].map((rod, rodIndex) => (
              <div key={rod} className="flex flex-col items-center">
                <div className="text-white font-bold mb-2">Rod {rod}</div>
                <div className="relative">
                  {/* Rod pole */}
                  <div className="w-2 h-48 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg"></div>
                  {/* Base */}
                  <div className="w-24 h-4 bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg -translate-x-11 translate-y-1"></div>
                  
                  {/* Disks */}
                  {(() => {
                    const towersArray = Array.isArray(animationState.towers)
                      ? animationState.towers
                      : [animationState.towers.A || [], animationState.towers.B || [], animationState.towers.C || []];
                    return towersArray[rodIndex]?.map((diskSize, diskIndex) => (
                      <div
                        key={diskIndex}
                        className={`absolute bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg h-6 border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm`}
                        style={{
                          width: `${diskSize * 8 + 32}px`,
                          left: `${-(diskSize * 4 + 12)}px`,
                          bottom: `${diskIndex * 28 + 16}px`
                        }}
                      >
                        {diskSize}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Move Counter */}
        <div className="bg-black/30 rounded-xl p-6 border border-gray-600">
          <h3 className="text-lg font-bold text-white mb-4">📊 Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {animationState.moveCount || 0}
              </div>
              <div className="text-gray-300">Moves Made</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.pow(2, numDisks) - 1}
              </div>
              <div className="text-gray-300">Minimum Moves</div>
            </div>
          </div>
          {/* Recent Moves Timeline */}
          {recentHanoiMoves.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-2">Recent Moves</h4>
              <div className="space-y-1 max-h-40 overflow-auto pr-2 text-xs font-mono">
                {recentHanoiMoves.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-700/40 px-2 py-1 rounded border border-slate-600/40">
                    <span className="text-cyan-300">#{m.moveCount}</span>
                    <span className="text-white">disk {m.move.disk}</span>
                    <span className="text-purple-300">{m.move.from} → {m.move.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    switch (selectedAlgorithm) {
      case 'factorial':
        return renderFactorialVisualization();
      case 'fibonacci':
        return renderFibonacciVisualization();
      case 'tower-hanoi':
        return renderTowerOfHanoiVisualization();
      default:
        return (
          <div className="text-center text-gray-400 py-12">
            Select a recursion algorithm to see visualization
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
          🔄 Recursion Visualization
        </div>
      </div>

      {renderVisualization()}
      
      {/* Current step indicator & description */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mt-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step: {animationState.currentStep + 1} / {animationState.steps.length || 0}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            animationState.isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {animationState.isRunning ? 'Computing' : 'Ready'}
          </span>
        </div>
        <div className="text-sm text-purple-800 font-medium">
          {animationState.highlight || 'Enter a number and click "Run Algorithm" to start recursion visualization'}
        </div>
        {currentStepData.description && (
          <div className="text-xs text-gray-600 bg-purple-50 border border-purple-200 rounded p-2 leading-relaxed">
            {currentStepData.description}
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          {currentStepData.type && (
            <span className="text-[10px] uppercase tracking-wide bg-slate-800 text-white px-2 py-1 rounded">{currentStepData.type}</span>
          )}
          {currentStepData.result !== undefined && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded">result: {currentStepData.result}</span>
          )}
          {currentStepData.finalResult !== undefined && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">final: {currentStepData.finalResult}</span>
          )}
        </div>
      </div>

      {/* Inline Help / Docs */}
      <div className="mt-6">
        <button
          onClick={() => setShowHelp(v => !v)}
          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded shadow inline-flex items-center gap-2"
        >
          {showHelp ? 'Hide Explanation' : 'Show Explanation'}
        </button>
        {showHelp && (
          <div className="mt-4 text-left space-y-4 text-sm text-gray-200 bg-slate-800/70 p-4 rounded-lg border border-slate-600">
            <p className="font-semibold text-white">How this visualization works:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-purple-300 font-medium">Call Stack</span>: Shows active recursive frames (top = most recent call).</li>
              <li><span className="text-purple-300 font-medium">Step Types</span>: call, base-case, return, recursive-call, move, memoized, complete.</li>
              <li><span className="text-purple-300 font-medium">Description Box</span>: Human explanation of what the current step is doing.</li>
              {selectedAlgorithm === 'factorial' && <li>Factorial expands downward until base case, then multiplies results while unwinding.</li>}
              {selectedAlgorithm === 'fibonacci' && <li>Fibonacci branches into two subcalls; memoization captures already computed results.</li>}
              {selectedAlgorithm === 'tower-hanoi' && <li>Hanoi solves by moving top n-1 to aux, largest to destination, then n-1 onto it.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecursionVisualizer;