// Save as: src/components/timeline/TimelineLegend.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { HistoricalEvent, Category, ImpactType } from '@/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineLegendProps {
  filteredEvents: HistoricalEvent[];
  categories: Category[];
  impactTypes: ImpactType[];
  onCategoryToggle?: (categoryId: string) => void;
  onImpactToggle?: (impactId: string) => void;
}

const CONNECTION_TYPES = [
  { id: 'effect', label: 'Effect Connection', color: 'bg-blue-400', description: 'Cause → Effect' },
  { id: 'cause', label: 'Cause Connection', color: 'bg-purple-400', description: 'Triggered By' },
  { id: 'paradox', label: 'Paradox Warning', color: 'bg-red-400', description: 'Timeline Instability' },
];

export const TimelineLegend: React.FC<TimelineLegendProps> = ({
  filteredEvents,
  categories,
  impactTypes,
  onCategoryToggle,
  onImpactToggle,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const activeCategories = useMemo(() => new Set(filteredEvents.map((e) => e.category)), [filteredEvents]);
  
  const activeImpacts = useMemo(
    () => new Set(filteredEvents.flatMap((e) => Object.keys(e.impact))),
    [filteredEvents]
  );

  const categoryStats = useMemo(
    () =>
      categories.reduce((acc, cat) => {
        const count = filteredEvents.filter((e) => e.category === cat.id).length;
        return { ...acc, [cat.id]: count };
      }, {} as Record<string, number>),
    [categories, filteredEvents]
  );

  const impactStats = useMemo(
    () =>
      impactTypes.reduce((acc, imp) => {
        const totalImpact = filteredEvents
          .flatMap((e) => Object.entries(e.impact))
          .filter(([key]) => key === imp.id)
          .reduce((sum, [_, val]) => sum + Math.abs(val), 0);
        return { ...acc, [imp.id]: totalImpact };
      }, {} as Record<string, number>),
    [impactTypes, filteredEvents]
  );

  const handleToggle = useCallback(
    (type: 'category' | 'impact', id: string) => {
      if (type === 'category' && onCategoryToggle) onCategoryToggle(id);
      if (type === 'impact' && onImpactToggle) onImpactToggle(id);
    },
    [onCategoryToggle, onImpactToggle]
  );

  const renderSection = (
    title: string,
    items: Array<{ id: string; label: string; color: string; description?: string }>,
    activeSet: Set<string>,
    stats: Record<string, number>,
    type: 'category' | 'impact' | 'connection'
  ) => (
    <div className="space-y-2">
      <div className="text-gray-700 dark:text-gray-200 font-medium text-base">{title}</div>
      {items.map((item) => {
        const isActive = type === 'connection' || activeSet.has(item.id);
        const statValue = type !== 'connection' ? stats[item.id] || 0 : null;

        return (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-2 transition-all duration-200 group',
              isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75',
              type !== 'connection' && 'cursor-pointer'
            )}
            onClick={() => type !== 'connection' && handleToggle(type, item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => setHoveredItem(item.id)}
            onBlur={() => setHoveredItem(null)}
            tabIndex={type !== 'connection' ? 0 : -1}
            role={type !== 'connection' ? 'checkbox' : 'presentation'}
            aria-checked={isActive}
            aria-label={`${item.label} - ${isActive ? 'Active' : 'Inactive'}`}
            onKeyPress={(e) => e.key === 'Enter' && type !== 'connection' && handleToggle(type, item.id)}
          >
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-transform duration-200',
                item.color,
                hoveredItem === item.id && 'scale-125 ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600'
              )}
            />
            <span className="text-gray-600 dark:text-gray-300 flex-1">
              {item.label}
              {type === 'category' && statValue !== null && ` (${statValue} events)`}
              {type === 'impact' && statValue !== null && ` (${statValue.toFixed(1)}% total)`}
            </span>

            {hoveredItem === item.id && (
              <div
                className={cn(
                  'absolute left-full ml-2 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white z-10 animate-fade-in'
                )}
                role="tooltip"
                aria-hidden={hoveredItem !== item.id}
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs">
                  {item.description ||
                    (type === 'category'
                      ? `${statValue} events in this timeline`
                      : `Total impact: ${statValue?.toFixed(1)}%`)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={cn(
        'flex flex-wrap gap-6 text-sm mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'
      )}
      role="region"
      aria-label="Timeline Legend"
    >
      {renderSection('Connections', CONNECTION_TYPES, new Set(), {}, 'connection')}

      <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
        {renderSection('Event Categories', categories, activeCategories, categoryStats, 'category')}
      </div>

      <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
        {renderSection('Impact Types', impactTypes, activeImpacts, impactStats, 'impact')}
      </div>
    </div>
  );
};

export default TimelineLegend;
