// Save as: src/components/timeline/EffectsPanel.tsx

import React from 'react';
import { TimelineEffects } from '@/types/timeline';

interface EffectsPanelProps {
  effects: TimelineEffects;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ effects }) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Timeline Effects</h3>
      <div className="space-y-4">
        {Object.entries(effects).map(([metric, value]) => (
          <div key={metric} className="flex items-center gap-2">
            <span className="capitalize w-24">{metric}</span>
            <div className="flex-1 bg-gray-200 h-4 rounded-full">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  value > 100 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{width: `${Math.min(Math.max(value, 0), 200)}%`}}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                  {value.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
