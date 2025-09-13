import React from 'react';
import { Info } from 'lucide-react';

const HashFunctionReference = () => {
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-white font-semibold text-lg">
        <Info size={18} className="text-emerald-400" />
        Hash Function Reference
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3">
          <div className="text-white font-medium">1. Modulo (Sum of Codes)</div>
          <pre className="bg-slate-950/60 p-3 rounded text-xs overflow-auto text-white"><code>{`function hashModulo(key, size) {\n  const codes = key.split('').map(c => c.charCodeAt(0));\n  const sum = codes.reduce((a,b) => a + b, 0);\n  return sum % size; // index\n}`}</code></pre>
          <ul className="text-xs text-slate-300 space-y-1 list-disc ml-4">
            <li>Fastest & simplest</li>
            <li>OK for varied keys; weak if many share similar chars</li>
            <li>Distribution suffers with patterned inputs (e.g. prefixes)</li>
          </ul>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3">
          <div className="text-white font-medium">2. Multiplication (Golden Ratio)</div>
          <pre className="bg-slate-950/60 p-3 rounded text-xs overflow-auto text-white"><code>{`function hashMultiply(key, size) {\n  const A = 0.6180339887; // golden ratio frac\n  const sum = [...key].reduce((a,c) => a + c.charCodeAt(0), 0);\n  const frac = (sum * A) % 1;\n  return Math.floor(size * frac);\n}`}</code></pre>
          <ul className="text-xs text-slate-300 space-y-1 list-disc ml-4">
            <li>Better spreads clustered sums</li>
            <li>Stable for table resizing (same A)</li>
            <li>Still sensitive if sums repeat exactly</li>
          </ul>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3">
          <div className="text-white font-medium">3. DJB2 (Bit Mixing)</div>
          <pre className="bg-slate-950/60 p-3 rounded text-xs overflow-auto text-white"><code>{`function hashDjb2(key, size) {\n  let hash = 5381;\n  for (let i = 0; i < key.length; i++) {\n    hash = ((hash << 5) + hash) + key.charCodeAt(i); // hash * 33 + c\n  }\n  return Math.abs(hash) % size;\n}`}</code></pre>
          <ul className="text-xs text-slate-300 space-y-1 list-disc ml-4">
            <li>Good avalanche effect</li>
            <li>More uniform for similar prefixes</li>
            <li>Slightly slower but still lightweight</li>
          </ul>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/40 border border-slate-700 rounded p-3 space-y-1">
          <div className="text-slate-300 font-semibold mb-1">Criterion</div>
          <div className="text-slate-400">Speed</div>
          <div className="text-slate-400">Distribution</div>
          <div className="text-slate-400">Handles Similar Keys</div>
          <div className="text-slate-400">Collision Risk (Bad Input)</div>
          <div className="text-slate-400">When To Use</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-3 space-y-1">
          <div className="text-emerald-400 font-semibold mb-1">Modulo</div>
          <div>⚡ Fastest</div>
          <div>Fair (depends on sums)</div>
          <div>Poor for patterned keys</div>
          <div>High if structure repeats</div>
          <div>Simple demos, tiny tables</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-3 space-y-1">
          <div className="text-indigo-400 font-semibold mb-1">Multiplication</div>
          <div>Fast</div>
          <div>Good</div>
          <div>Moderate</div>
          <div>Lower than modulo</div>
          <div>General purpose</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-700 rounded p-3 space-y-1">
          <div className="text-yellow-400 font-semibold mb-1">DJB2</div>
          <div>Medium</div>
          <div>Very good</div>
          <div>Strong</div>
          <div>Lowest typical</div>
          <div>Demo of quality hashing</div>
        </div>
      </div>
      <div className="text-xs text-slate-400 leading-relaxed">
        <span className="text-slate-300 font-semibold">Choosing:</span> If you just want speed and keys are random, Modulo is fine. For more predictable spread with minimal code, Multiplication is a solid default. Use DJB2 when demonstrating better mixing or when keys share prefixes.
      </div>
    </div>
  );
};

export default HashFunctionReference;
