import React, { Suspense, lazy } from 'react';
import "./App.css";
import { BarChart3, GitBranch, Search, Hash } from 'lucide-react';
import { AlgorithmProvider } from './context/AlgorithmContext';
import { AnimationProvider } from './context/AnimationContext';
import { LogsProvider } from './context/LogsContext';
import AlgorithmSelector from './components/AlgorithmSelector';
// Visualization components (heavy) -> lazy loaded
const SortingVisualizer = lazy(() => import('./components/Visualization/SortingVisualizer'));
const SearchVisualizer = lazy(() => import('./components/Visualization/SearchVisualizer'));
const HashTableVisualizer = lazy(() => import('./components/Visualization/HashTableVisualizer'));
const HashFunctionComparison = lazy(() => import('./components/Visualization/HashFunctionComparison'));
const RecursionVisualizer = lazy(() => import('./components/Visualization/RecursionVisualizer'));
// Controls & misc (likely lighter) - keep eager for simplicity
import AlgorithmControls from './components/Controls/AlgorithmControls';
import AlgorithmStatus from './components/Controls/AlgorithmStatus';
import InteractiveDataEditor from './components/Controls/InteractiveDataEditor';
import AlgorithmLogs from './components/Logs/AlgorithmLogs';
import HeroHeader from './components/HeroHeader';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { useAlgorithm } from './context/AlgorithmContext';
import { useAnimation } from './context/AnimationContext';
import ErrorBoundary from './components/ErrorBoundary';

// Algorithm definitions - will be moved to a separate config file later
const algorithms = {
  sorting: {
    name: 'Sorting Algorithms',
    icon: <BarChart3 className="w-5 h-5" />,
    items: {
      'bubble-sort': { name: 'Bubble Sort', complexity: 'O(n²)' },
      'selection-sort': { name: 'Selection Sort', complexity: 'O(n²)' },
      'insertion-sort': { name: 'Insertion Sort', complexity: 'O(n²)' },
      'merge-sort': { name: 'Merge Sort', complexity: 'O(n log n)' },
      'quick-sort': { name: 'Quick Sort', complexity: 'O(n log n)' }
    }
  },
  searching: {
    name: 'Search Algorithms',
    icon: <Search className="w-5 h-5" />,
    items: {
      'linear-search': { name: 'Linear Search', complexity: 'O(n)' },
      'binary-search': { name: 'Binary Search', complexity: 'O(log n)' }
    }
  },
  hashing: {
    name: 'Hash Tables',
    icon: <Hash className="w-5 h-5" />,
    items: {
      'hash-chaining': { name: 'Hash with Chaining', complexity: 'O(1) avg' },
      'hash-probing': { name: 'Hash with Linear Probing', complexity: 'O(1) avg' }
    }
  },
  recursive: {
    name: 'Recursion',
    icon: <GitBranch className="w-5 h-5" />,
    items: {
      'factorial': { name: 'Factorial', complexity: 'O(n)' },
      'fibonacci': { name: 'Fibonacci', complexity: 'O(2^n)' },
      'tower-hanoi': { name: 'Tower of Hanoi', complexity: 'O(2^n)' }
    }
  }
};

const LoadingChunk = ({ label = 'Loading visualization...' }) => (
  <div className="flex items-center justify-center h-64 text-slate-300 animate-pulse">
    <div className="text-center space-y-2">
      <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
      <p className="text-sm tracking-wide uppercase font-medium opacity-80">{label}</p>
    </div>
  </div>
);

const MainContent = () => {
  const { selectedAlgorithm, selectedCategory, data, inputValue } = useAlgorithm();
  const animationState = useAnimation();
  const algorithmRunner = useAlgorithmRunner();

  if (!selectedCategory || !selectedAlgorithm) {
    return (
      <div className="lg:col-span-3 space-y-6">
        <div className="card h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <GitBranch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">Select an Algorithm</h3>
            <p className="text-gray-500 text-lg">Choose an algorithm category to begin visualization</p>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="lg:col-span-3 3xl:col-span-4 space-y-6">
      {/* Algorithm Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {algorithms[selectedCategory].icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {algorithms[selectedCategory].items[selectedAlgorithm].name}
              </h2>
              <p className="text-gray-600">{algorithms[selectedCategory].name}</p>
            </div>
          </div>
          <div className="text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full font-mono font-semibold shadow-lg">
            {algorithms[selectedCategory].items[selectedAlgorithm].complexity}
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="card p-6">
        <ErrorBoundary watch={[selectedCategory, selectedAlgorithm]}>
          <Suspense fallback={<LoadingChunk />}> 
            {selectedCategory === 'sorting' && (
              <SortingVisualizer data={data} animationState={animationState} />
            )}
            {selectedCategory === 'searching' && (
              <SearchVisualizer
                data={data}
                animationState={animationState}
                targetValue={inputValue}
              />
            )}
            {selectedCategory === 'hashing' && (
              <>
                <HashFunctionComparison />
                <div className="mt-8">
                  <HashTableVisualizer animationState={animationState} />
                </div>
              </>
            )}
            {selectedCategory === 'recursive' && (
              <RecursionVisualizer
                animationState={animationState}
                selectedAlgorithm={selectedAlgorithm}
                inputValue={inputValue}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Controls */}
        <div className="md:col-span-2">
          <AlgorithmControls 
            needsInput={['binary-search', 'linear-search', 'factorial', 'fibonacci', 'tower-hanoi'].includes(selectedAlgorithm)}
            selectedCategory={selectedCategory}
            selectedAlgorithm={selectedAlgorithm}
            algorithmRunner={algorithmRunner}
          />
        </div>
        
        {/* Algorithm Status */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <AlgorithmStatus 
              algorithmRunner={algorithmRunner} 
              selectedCategory={selectedCategory} 
              selectedAlgorithm={selectedAlgorithm}
            />
          </div>
        </div>
      </div>
      
  {/* Step Controls removed: functionality consolidated into AlgorithmControls */}
      
      {/* Logs */}
      <AlgorithmLogs />
    </div>
  );
};

const RichVisualAlgorithmExplorer = () => {
  return (
    <AlgorithmProvider>
      <AnimationProvider>
        <LogsProvider>
          <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-left">
            {/* Sidebar */}
            <aside className="hidden md:flex md:flex-col w-72 xl:w-80 bg-slate-950/70 backdrop-blur-md border-r border-white/10 p-5 gap-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-2 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="relative inline-block select-none">
                  <h1 className="text-[1.15rem] font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] px-2 py-1 rounded-lg">
                    <span className="relative z-10 block">Algorithm<br/>Visualizer</span>
                    <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-lg blur-xl opacity-80 bg-[radial-gradient(circle_at_30%_35%,rgba(99,102,241,0.55),transparent_70%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.5),transparent_72%),linear-gradient(90deg,rgba(59,130,246,0.35),rgba(139,92,246,0.35))]" />
                  </h1>
                </div>
              </div>
              <div className="space-y-4">
                <AlgorithmSelector algorithms={algorithms} />
                <InteractiveDataEditor />
              </div>
              <div className="mt-auto text-[11px] text-slate-400 pt-4 border-t border-white/10">
                <p>1. Pick algorithm</p>
                <p>2. (Optional) Adjust data</p>
                <p>3. Run & inspect steps</p>
              </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
              {/* Top bar */}
              <HeroHeader />

              {/* Scrollable content */}
              <div className="flex-1 px-6 py-6 space-y-8">
                <MainContent />
              </div>
            </div>
          </div>
        </LogsProvider>
      </AnimationProvider>
    </AlgorithmProvider>
  );
};




export default RichVisualAlgorithmExplorer;