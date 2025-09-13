import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  Edit3, 
  Check, 
  X, 
  Shuffle, 
  RotateCcw,
  Trash2,
  Save,
  Upload
} from 'lucide-react';
import { useAlgorithm } from '../../context/AlgorithmContext';

const InteractiveDataEditor = ({ className = "" }) => {
  const { data, setData, resetData } = useAlgorithm();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempValue, setTempValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const inputRef = useRef(null);

  // Predefined data sets
  const presetData = {
    small: [5, 2, 8, 1, 9],
    medium: [64, 34, 25, 12, 22, 11, 90, 5],
    large: [45, 23, 67, 34, 89, 12, 56, 78, 90, 33, 21, 55],
    reversed: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    sorted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    duplicates: [5, 3, 8, 3, 1, 5, 9, 1, 7, 3]
  };

  const handleAddElement = () => {
    const value = parseInt(newValue);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      setData([...data, value]);
      setNewValue('');
    }
  };

  const handleRemoveElement = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleEditElement = (index) => {
    setEditingIndex(index);
    setTempValue(data[index].toString());
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveEdit = () => {
    const value = parseInt(tempValue);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      const newData = [...data];
      newData[editingIndex] = value;
      setData(newData);
    }
    setIsEditing(false);
    setEditingIndex(-1);
    setTempValue('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(-1);
    setTempValue('');
  };

  const handleShuffle = () => {
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setData(shuffled);
  };

  const generateRandomData = (size) => {
    const randomData = Array.from(
      { length: size }, 
      () => Math.floor(Math.random() * 99) + 1
    );
    setData(randomData);
  };

  const loadPreset = (preset) => {
    setData([...presetData[preset]]);
  };

  const exportData = () => {
    const dataString = data.join(', ');
    navigator.clipboard.writeText(dataString);
    // You could also show a toast notification here
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const numbers = content
            .split(/[,\s\n]+/)
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= 99);
          
          if (numbers.length > 0) {
            setData(numbers);
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Edit3 size={20} />
          Data Editor
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {data.length} element{data.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {/* Quick Instructions */}
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="text-sm text-blue-300 font-medium mb-1">Quick Guide:</div>
        <div className="text-xs text-blue-200 space-y-1">
          <div>• Click numbers below to edit them</div>
          <div>• Use presets for quick setup</div>
          <div>• Add/remove elements as needed</div>
        </div>
      </div>

      {/* Data Array Visualization */}
      <div className="mb-6">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
          {data.length === 0 ? (
            <div className="text-slate-400 text-center py-8">
              <div className="mb-2">No data elements</div>
              <div className="text-sm">Add elements below to get started</div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-3 py-2 min-w-[50px] text-center"
                >
                  {isEditing && editingIndex === index ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={inputRef}
                        type="number"
                        min="1"
                        max="99"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="w-12 text-center bg-slate-700 text-white border border-slate-600 rounded text-sm p-1"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 text-green-400 hover:text-green-300"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-white font-mono font-medium">{value}</div>
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditElement(index)}
                            className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs"
                            title="Edit"
                          >
                            <Edit3 size={10} />
                          </button>
                          <button
                            onClick={() => handleRemoveElement(index)}
                            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs"
                            title="Remove"
                          >
                            <Minus size={10} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        [{index}]
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add New Element */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <div className="text-sm text-green-300 font-medium mb-2">➕ Add New Number</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="99"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddElement()}
            placeholder="Enter value (1-99)"
            className="flex-1 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddElement}
            disabled={!newValue || isNaN(parseInt(newValue)) || parseInt(newValue) < 1 || parseInt(newValue) > 99}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShuffle}
              disabled={data.length < 2}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <Shuffle size={14} />
              Shuffle
            </button>
            <button
              onClick={resetData}
              className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={() => setData([])}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Generate Random</h4>
          <div className="flex flex-wrap gap-2">
            {[5, 8, 10, 12, 15].map(size => (
              <button
                key={size}
                onClick={() => generateRandomData(size)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                {size} items
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-emerald-300 mb-2">🎯 Quick Start Presets</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(presetData).map(([key, values]) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all text-left flex justify-between items-center"
                title={`Click to load: [${values.join(', ')}]`}
              >
                <div>
                  <div className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="text-xs text-emerald-100 truncate max-w-[120px]">
                    [{values.slice(0, 5).join(', ')}{values.length > 5 ? '...' : ''}]
                  </div>
                </div>
                <div className="text-xs bg-emerald-800 px-2 py-1 rounded-full">
                  {values.length}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Data Management</h4>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              disabled={data.length === 0}
              className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Save size={14} />
              Copy to Clipboard
            </button>
            <label className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={14} />
              Import from File
              <input
                type="file"
                accept=".txt,.csv"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDataEditor;