import React from 'react';
import { Activity } from 'lucide-react';
import { useLogs } from '../../context/LogsContext';

const AlgorithmLogs = () => {
  const { logs } = useLogs();
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
          <Activity size={18} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Activity Log</h3>
      </div>
      
      <div className="bg-black/40 rounded-xl p-4 font-mono text-sm h-80 overflow-y-auto border border-gray-600 backdrop-blur-sm">
        {logs.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={24} className="text-gray-400" />
            </div>
            <p className="text-lg">Ready to run algorithms...</p>
            <p className="text-xs mt-2 opacity-70">Activity will appear here during execution</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => {
              const isLatest = index === logs.length - 1;
              const typeConfig = {
                error: { color: 'text-red-400', icon: '❌', bg: 'bg-red-500/10' },
                success: { color: 'text-emerald-400', icon: '✅', bg: 'bg-emerald-500/10' },
                warning: { color: 'text-yellow-400', icon: '⚠️', bg: 'bg-yellow-500/10' },
                info: { color: 'text-blue-400', icon: '📄', bg: 'bg-blue-500/10' }
              };
              
              const config = typeConfig[log.type] || typeConfig.info;
              
              return (
                <div 
                  key={log.timestamp} 
                  className={`p-3 rounded-lg border border-gray-600/30 ${config.bg} ${config.color} ${
                    isLatest ? 'animate-fade-in ring-2 ring-blue-500/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{config.icon}</span>
                    <div className="flex-1">
                      <p className="leading-relaxed">{log.message}</p>
                      <div className="text-xs opacity-60 mt-1">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmLogs;
