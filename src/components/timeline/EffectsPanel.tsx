// Save as: src/components/timeline/EffectsPanel.tsx

import React, { useState, useEffect, useRef } from 'react';
import { TimelineEffects } from '@/types/timeline';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classNames

// Define types
interface EffectHistory {
  timestamp: number;
  value: number;
}

interface EffectsPanelProps {
  effects: TimelineEffects;
  year: number; // Current year for context
  onMetricSelect?: (metric: string) => void; // Callback for drilling into a metric
}

const METRIC_THRESHOLDS = {
  warning: 50,   // Below this, show a warning
  critical: 150, // Above this, show a critical alert
};

// Mini graph component for historical trend
const TrendGraph: React.FC<{
  history: EffectHistory[];
  color: string;
  metric: string;
}> = ({ history, color, metric }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const maxValue = Math.max(...history.map((h) => h.value), 200);
  const minValue = Math.min(...history.map((h) => h.value), 0);

  const pathData = history
    .map((point, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = ((point.value - minValue) / (maxValue - minValue)) * 40;
      return `${i === 0 ? 'M' : 'L'} ${x} ${40 - y}`;
    })
    .join(' ');

  return (
    <svg ref={svgRef} className="w-24 h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path d={pathData} stroke={color} strokeWidth="1.5" fill="none" />
      <title>{`Trend for ${metric} over time`}</title>
    </svg>
  );
};

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ effects, year, onMetricSelect }) => {
  const [history, setHistory] = useState<Record<string, EffectHistory[]>>(() =>
    Object.keys(effects).reduce((acc, metric) => ({
      ...acc,
      [metric]: [{ timestamp: year, value: effects[metric] }],
    }), {})
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const prevEffectsRef = useRef<TimelineEffects>(effects);

  // Update history when effects change
  useEffect(() => {
    const changed = Object.keys(effects).some(
      (metric) => effects[metric] !== prevEffectsRef.current[metric]
    );
    if (changed) {
      setIsAnimating(true);
      setHistory((prev) =>
        Object.keys(effects).reduce((acc, metric) => ({
          ...acc,
          [metric]: [
            ...(prev[metric] || []),
            { timestamp: year, value: effects[metric] },
          ].slice(-10), // Keep last 10 entries for trend
        }), {})
      );
      const timeout = setTimeout(() => setIsAnimating(false), 300); // Animation duration
      prevEffectsRef.current = { ...effects };
      return () => clearTimeout(timeout);
    }
  }, [effects, year]);

  const getStatusColor = (value: number) => {
    if (value <= METRIC_THRESHOLDS.warning) return 'bg-yellow-500 dark:bg-yellow-400';
    if (value >= METRIC_THRESHOLDS.critical) return 'bg-orange-500 dark:bg-orange-400';
    return value > 100 ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400';
  };

  const getStatusMessage = (metric: string, value: number) => {
    if (value <= METRIC_THRESHOLDS.warning)
      return `${metric} is critically low - potential societal collapse imminent!`;
    if (value >= METRIC_THRESHOLDS.critical)
      return `${metric} is surging - watch for destabilizing effects!`;
    return `${metric} is ${value > 100 ? 'thriving' : 'struggling'} in ${year}.`;
  };

  return (
    <div
      className={cn(
        'mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300',
        isAnimating && 'ring-2 ring-blue-500 dark:ring-blue-400'
      )}
      role="region"
      aria-label="Timeline Effects Dashboard"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Temporal Impact Dashboard - {year}
      </h3>
      <div className="space-y-6">
        {Object.entries(effects).map(([metric, value]) => {
          const statusColor = getStatusColor(value);
          const percentage = Math.min(Math.max(value, 0), 200);
          const trendColor =
            value > 100 ? '#10B981' : value <= METRIC_THRESHOLDS.warning ? '#F59E0B' : '#EF4444';

          return (
            <div
              key={metric}
              className="flex items-center gap-4 group relative"
              tabIndex={0}
              role="button"
              aria-label={`View details for ${metric}`}
              onClick={() => onMetricSelect?.(metric)}
              onKeyPress={(e) => e.key === 'Enter' && onMetricSelect?.(metric)}
            >
              {/* Metric Label */}
              <span className="capitalize w-24 text-gray-700 dark:text-gray-200 font-medium">
                {metric}
              </span>

              {/* Progress Bar */}
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-6 rounded-full relative overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300 relative',
                    statusColor,
                    isAnimating && 'animate-pulse'
                  )}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={200}
                  aria-label={`${metric} impact: ${value.toFixed(1)}%`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white dark:text-gray-900 font-semibold">
                    {value.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Trend Graph */}
              <TrendGraph
                history={history[metric] || []}
                color={trendColor}
                metric={metric}
              />

              {/* Tooltip */}
              <div
                className={cn(
                  'absolute top-full left-24 mt-2 w-64 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none z-10'
                )}
                role="tooltip"
                aria-hidden={!hovered}
              >
                <div className="font-medium text-gray-900 dark:text-white capitalize">
                  {metric} Status
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">
                  {getStatusMessage(metric, value)}
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    Trend over last {history[metric]?.length || 0} updates
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Temporal Anomalies Warning */}
      {Object.entries(effects).some(
        ([_, value]) => value <= METRIC_THRESHOLDS.warning || value >= METRIC_THRESHOLDS.critical
      ) && (
        <div
          className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-yellow-700 dark:text-yellow-200 text-sm animate-fade-in"
          role="alert"
        >
          Warning: Temporal anomalies detected! Some metrics are at critical levels.
        </div>
      )}
    </div>
  );
};

// Utility styles in Tailwind (add to your globals.css if not present)
const additionalStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-in-out;
  }
`;
