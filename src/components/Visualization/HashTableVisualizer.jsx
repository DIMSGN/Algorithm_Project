import React from 'react';
import { Hash, ArrowRight, Target, Zap, TrendingUp } from 'lucide-react';

const HashTableVisualizer = ({ animationState }) => {
  
  // Continue with classic visualization
  const stepData = animationState.currentStepData || {};
  const hashTable = stepData.hashTable || animationState.hashTable || Array(7).fill(null).map(() => []);
  const tableSize = Array.isArray(hashTable) ? hashTable.length : 0;
  const isChaining = hashTable.some(bucket => Array.isArray(bucket));
  const hashInfo = stepData.currentHashStep || animationState.currentHashStep || null;
  const highlightedBucket = stepData.inserted !== undefined ? stepData.inserted : (hashInfo?.hash !== undefined ? hashInfo.hash : null);

  // Statistics
  const totalElements = isChaining
    ? hashTable.reduce((sum, bucket) => sum + bucket.length, 0)
    : hashTable.filter(slot => slot && (slot.key || slot.value || typeof slot === 'string')).length;
  const loadFactor = tableSize > 0 ? (totalElements / tableSize).toFixed(2) : 0;
  const occupiedBuckets = isChaining ? hashTable.filter(b => b.length > 0).length : totalElements;
  const collisions = isChaining ? hashTable.filter(b => b.length > 1).length : 0; // probing collisions inferred differently
  const maxChainLength = isChaining ? Math.max(...hashTable.map(b => b.length)) : 1;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-slate-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Hash Table Visualization</h2>
              <p className="text-sm text-gray-400">Size: {tableSize} | Load Factor: {loadFactor}</p>
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

      {/* Code Visualization Panel for Modulo Operation */}
      {hashInfo && hashInfo.steps && (
        <div className="bg-slate-900/70 border border-purple-700/40 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-purple-300">Code Visualization: Modulo Operation</span>
          </div>
          <div className="space-y-2 font-mono text-xs text-purple-200">
            {hashInfo.steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-purple-400">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-purple-400 bg-purple-900/30 rounded p-2">
            <strong>Code:</strong> <span className="font-mono">hash = sum % size</span>
          </div>
        </div>
      )}
            {/* All hashInfo references and panels removed as requested */}

      {/* Removed initial hash function demo block per user request */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hash Table Structure */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Hash Table Structure
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {hashTable.map((bucket, index) => {
              // Normalize bucket for probing mode
              const bucketItems = isChaining ? bucket : (hashTable[index] === null ? [] : [hashTable[index]]);
              const isHighlighted = highlightedBucket === index;
              const isEmpty = bucketItems.length === 0;
              const hasCollision = isChaining && bucketItems.length > 1;

              return (
                <div key={index} className={`flex items-center gap-3 transition-all duration-300 ${isHighlighted ? 'scale-105 bg-blue-500/10 rounded-lg p-2' : ''}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all ${isHighlighted ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>{index}</div>
                  <ArrowRight className={`w-4 h-4 transition-colors ${isHighlighted ? 'text-blue-400' : 'text-gray-500'}`} />
                  <div className={`flex-1 min-h-[40px] rounded-lg border flex items-center p-2 transition-all ${isHighlighted ? 'bg-blue-500/10 border-blue-500/50' : isEmpty ? 'bg-slate-800/30 border-slate-600/50' : hasCollision ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
                    {isEmpty ? (
                      <span className="text-gray-500 italic text-sm">empty</span>
                    ) : (
                      <div className="flex gap-1 flex-wrap">
                        {bucketItems.map((item, itemIndex) => {
                          const display = typeof item === 'object' ? `${item.key}:${item.value}` : (item?.key ? `${item.key}:${item.value}` : item?.key === undefined && typeof item === 'string' ? item : item?.key);
                          return (
                            <div key={itemIndex} className={`px-2 py-1 rounded-full text-sm font-medium transition-all ${hasCollision ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-gradient-to-r from-emerald-500 to-green-400 text-white'}`}>{display || (item?.key ? item.key : '')}</div>
                          );
                        })}
                        {hasCollision && <div className="text-xs text-red-400 font-medium ml-2">Chain({bucketItems.length})</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics and Performance Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </h3>
          
          {/* Load Factor Gauge */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">Load Factor</span>
              <span className={`text-sm font-bold ${
                loadFactor > 0.75 ? 'text-red-400' : 
                loadFactor > 0.5 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {loadFactor}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  loadFactor > 0.75 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  loadFactor > 0.5 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${Math.min(loadFactor * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Optimal range: 0.5 - 0.75
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-400">{occupiedBuckets}</div>
              <div className="text-xs text-slate-400">Occupied Buckets</div>
              <div className="text-xs text-slate-500">
                {((occupiedBuckets / tableSize) * 100).toFixed(1)}% utilization
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-400">{maxChainLength}</div>
              <div className="text-xs text-slate-400">Max Chain Length</div>
              <div className="text-xs text-slate-500">
                Longest collision chain
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 col-span-2">
              <div className="text-lg font-bold text-emerald-400">
                {totalElements > 0 ? (collisions / totalElements * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-slate-400">Collision Rate</div>
              <div className="text-xs text-slate-500">
                {collisions} collisions out of {totalElements} insertions
              </div>
            </div>
          </div>

          {/* Performance Recommendations */}
          {loadFactor > 0.75 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="text-sm font-medium text-red-400 mb-1">⚠️ High Load Factor</div>
              <div className="text-xs text-red-300">
                Consider resizing the hash table to improve performance
              </div>
            </div>
          )}
          
          {collisions > totalElements * 0.3 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <div className="text-sm font-medium text-orange-400 mb-1">📊 High Collision Rate</div>
              <div className="text-xs text-orange-300">
                Try a different hash function for better distribution
              </div>
            </div>
          )}
        </div>
      </div>

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
          <div className="text-sm mb-2">Use the controls below to generate hash table steps.</div>
          <div className="text-xs text-slate-500">Pick a hash function & table size, then click Generate or Run.</div>
        </div>
      )}
      </div>
    </div>
  );
};

export default HashTableVisualizer;