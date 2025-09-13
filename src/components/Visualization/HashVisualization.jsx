import React from 'react';
import { Hash, Network } from 'lucide-react';
import ModernHashFunctionComparison from './ModernHashFunctionComparison';

// Hash visualization component that uses the ModernHashFunctionComparison
export default function HashVisualization() {
  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network size={24} className="text-blue-400" />
            Hash Function Visualization
          </h2>
        </div>
      </div>
      
      {/* Modern Hash Function Comparison */}
      <ModernHashFunctionComparison />
      
      {/* Explanation */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-2">How Hash Functions Work</h3>
        <p className="text-slate-300 text-sm">
          A hash function converts variable-length data (like a string) into a fixed-size value.
          This value is then used as an index to store the data in a hash table, enabling quick lookups.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">Sum Hash</div>
            <p className="text-sm text-slate-400">
              Adds ASCII values of each character, then takes modulo of table size
            </p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="font-medium text-white mb-1">DJB2 Hash</div>
            <p className="text-sm text-slate-400">
              Multiplies by 33 and adds each character code for better distribution
            </p>
          </div>
        </div>
      </div>
      
      {/* Interactive learning section */}
      <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700">
        <div className="text-white font-medium mb-2">Try It: Hash Calculation</div>
        <div className="text-sm text-slate-300">
          Example: "cat" → sum of ASCII codes (99 + 97 + 116 = 312) → 312 % 8 = 0
        </div>
      </div>
    </div>
  );
}