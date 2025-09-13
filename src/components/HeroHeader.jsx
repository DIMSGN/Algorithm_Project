import React from 'react';
import { BarChart3, Zap, Layers, GitBranch } from 'lucide-react';

const statItems = [
  { label: 'Algorithms', value: 15, icon: <Layers className="w-4 h-4" /> },
  { label: 'Categories', value: 4, icon: <GitBranch className="w-4 h-4" /> },
  { label: 'Interactive Steps', value: 'Live', icon: <Zap className="w-4 h-4" /> }
];

const HeroHeader = () => {
  return (
    <div className="relative w-full py-10 md:py-14 flex flex-col items-center text-center">
      {/* Background Accents */}
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl ring-4 ring-white/10 mb-6 animate-[pulseSoft_5s_ease-in-out_infinite]">
          <BarChart3 className="w-12 h-12 md:w-14 md:h-14 text-white" />
        </div>
        <h1 className="relative text-[clamp(2.75rem,6vw,3.9rem)] font-extrabold tracking-tight leading-[1.15] select-none inline-block px-6 py-4 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          Algorithm Workspace
          <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-80 bg-[radial-gradient(circle_at_25%_35%,rgba(99,102,241,0.55),transparent_70%),radial-gradient(circle_at_75%_65%,rgba(168,85,247,0.50),transparent_72%),linear-gradient(90deg,rgba(59,130,246,0.35),rgba(139,92,246,0.35))]" />
        </h1>
        <p className="mt-8 md:mt-10 text-base md:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
          Interactive visual execution, introspection, and step-by-step exploration of core computer science algorithms.
        </p>
        <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-4">
          {statItems.map(item => (
            <div key={item.label} className="group relative px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition shadow-lg flex items-center gap-2">
              <span className="text-indigo-300">{item.icon}</span>
              <span className="text-sm font-medium text-slate-200">{item.label}:</span>
              <span className="text-sm font-semibold text-white">{item.value}</span>
              <div className="absolute inset-px rounded-xl border border-white/5 group-hover:border-white/20 transition" />
            </div>
          ))}
        </div>
        <div className="mt-14 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-400/30">
            <h3 className="text-sm font-semibold text-blue-200 mb-1">Visual Depth</h3>
            <p className="text-xs text-slate-300 leading-relaxed">Every step captures its own snapshot so you can pause, inspect, and rewind logically.</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-600/10 border border-purple-400/30">
            <h3 className="text-sm font-semibold text-purple-200 mb-1">Adaptive Layout</h3>
            <p className="text-xs text-slate-300 leading-relaxed">Wide-screen optimized grid plus focused sidebar for rapid switching.</p>
          </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-400/30">
            <h3 className="text-sm font-semibold text-emerald-200 mb-1">Exploratory Mode</h3>
            <p className="text-xs text-slate-300 leading-relaxed">Switch algorithms without losing context and compare strategies interactively.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
