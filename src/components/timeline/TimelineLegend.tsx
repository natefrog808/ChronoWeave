// Save as: src/components/timeline/TimelineLegend.tsx

import React from 'react';
import { HistoricalEvent, Category, ImpactType } from '@/types/timeline';

interface TimelineLegendProps {
  filteredEvents: HistoricalEvent[];
  categories: Category[];
  impactTypes: ImpactType[];
}

export const TimelineLegend: React.FC<TimelineLegendProps> = ({
  filteredEvents,
  categories,
  impactTypes
}) => {
  const activeCategories = new Set(filteredEvents.map(e => e.category));
  const activeImpacts = new Set(
    filteredEvents.flatMap(e => Object.keys(e.impact))
  );

  return (
    <div className="flex flex-wrap gap-4 text-sm mt-4 p-2 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <div className="text-gray-700 font-medium">Connections</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-400"></div>
          <span className="text-gray-600">Effect Connection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-purple-400"></div>
          <span className="text-gray-600">Cause Connection</span>
        </div>
      </div>

      <div className="border-l border-gray-300 pl-4 space-y-2">
        <div className="text-gray-700 font-medium">Event Categories</div>
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`flex items-center gap-2 transition-opacity ${
              activeCategories.has(category.id) ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
            <span className="text-gray-600">{category.label} Events</span>
          </div>
        ))}
      </div>

      <div className="border-l border-gray-300 pl-4 space-y-2">
        <div className="text-gray-700 font-medium">Impact Types</div>
        {impactTypes.map(impact => (
          <div 
            key={impact.id} 
            className={`flex items-center gap-2 transition-opacity ${
              activeImpacts.has(impact.id) ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${impact.color}`}></div>
            <span className="text-gray-600">{impact.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
