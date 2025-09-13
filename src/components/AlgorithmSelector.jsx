import React from 'react';
import { Eye } from 'lucide-react';
import { useAlgorithm } from '../context/AlgorithmContext';

const AlgorithmSelector = ({ algorithms }) => {
  const { selectedCategory, selectedAlgorithm, setCategory, setAlgorithm } = useAlgorithm();

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Eye size={16} className="text-white" />
          </div>
          Algorithm Categories
        </h2>
        
        <div className="space-y-3">
          {Object.entries(algorithms).map(([categoryKey, category]) => (
            <div key={categoryKey} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              <button
                onClick={() => {
                  setCategory(categoryKey, Object.keys(category.items)[0]);
                }}
                className={`w-full p-4 text-left flex items-center gap-3 transition-all duration-300 ${
                  selectedCategory === categoryKey
                    ? 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  {category.icon}
                </div>
                <span className="font-medium text-lg">{category.name}</span>
              </button>
              
              {selectedCategory === categoryKey && (
                <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
                  {Object.entries(category.items).map(([algKey, algorithm]) => (
                    <button
                      key={algKey}
                      onClick={() => setAlgorithm(algKey)}
                      className={`w-full p-4 text-left transition-all duration-200 ${
                        selectedAlgorithm === algKey
                          ? 'bg-gradient-to-r from-blue-500/60 to-purple-500/60 border-l-4 border-blue-400 text-white shadow-inner'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="font-medium text-base">{algorithm.name}</div>
                      <div className="text-sm opacity-70 font-mono">{algorithm.complexity}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSelector;