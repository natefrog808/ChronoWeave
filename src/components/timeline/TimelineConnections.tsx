// Save as: src/components/timeline/TimelineConnections.tsx

import React, { useMemo, useState } from 'react';
import { TimelineConnection } from '@/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineConnectionsProps {
  connections: TimelineConnection[];
  containerWidth: number; // Width of the timeline container in pixels
  containerHeight?: number; // Optional height for vertical scaling
  baseYear?: number; // Starting year (default 1800)
}

interface ConnectionStyle {
  stroke: string;
  strokeDasharray?: string;
  label: string;
}

const CONNECTION_STYLES: Record<string, ConnectionStyle> = {
  effect: {
    stroke: 'rgba(59, 130, 246, 0.7)', // Blue for effects
    strokeDasharray: '5,5',
    label: 'Cause → Effect',
  },
  dependency: {
    stroke: 'rgba(147, 51, 234, 0.7)', // Purple for dependencies
    strokeDasharray: '2,2',
    label: 'Dependency Link',
  },
  paradox: {
    stroke: 'rgba(239, 68, 68, 0.7)', // Red for paradoxes
    strokeDasharray: '10,5',
    label: 'Paradox Warning',
  },
};

export const TimelineConnections: React.FC<TimelineConnectionsProps> = ({
  connections,
  containerWidth,
  containerHeight = 100,
  baseYear = 1800,
}) => {
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);

  // Memoize path calculations for performance
  const connectionPaths = useMemo(() => {
    return connections.map((connection, index) => {
      const startX = ((connection.from - baseYear) / 50) * containerWidth; // Scale to 50-year span
      const endX = ((connection.to - baseYear) / 50) * containerWidth;
      const midX = (startX + endX) / 2;
      const controlY = containerHeight * 0.2; // Curve height (20% of container height)
      const style = CONNECTION_STYLES[connection.type] || CONNECTION_STYLES.effect;

      // Quadratic Bézier curve: M (start) Q (control point) (end)
      const pathD = `M ${startX} ${containerHeight * 0.8} Q ${midX} ${controlY} ${endX} ${containerHeight * 0.8}`;

      return { id: index, pathD, style, connection, startX, endX };
    });
  }, [connections, containerWidth, containerHeight, baseYear]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={containerWidth}
      height={containerHeight}
      style={{ zIndex: 10 }}
      role="img"
      aria-label="Timeline connections between historical events"
    >
      <defs>
        {/* Gradient for animation */}
        <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
        </linearGradient>
      </defs>

      {connectionPaths.map(({ id, pathD, style, connection, startX, endX }) => (
        <g
          key={id}
          className="pointer-events-auto"
          onMouseEnter={() => setHoveredConnection(id)}
          onMouseLeave={() => setHoveredConnection(null)}
          onFocus={() => setHoveredConnection(id)}
          onBlur={() => setHoveredConnection(null)}
          tabIndex={0}
          role="button"
          aria-label={`${style.label} from ${connection.from} to ${connection.to}`}
        >
          {/* Connection Path */}
          <path
            d={pathD}
            stroke={style.stroke}
            strokeWidth={hoveredConnection === id ? 3 : 2}
            strokeDasharray={style.strokeDasharray}
            fill="none"
            className={cn(
              'transition-all duration-300',
              hoveredConnection === id && 'animate-pulse'
            )}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={style.strokeDasharray === '5,5' ? '-10' : '-4'}
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Tooltip */}
          {hoveredConnection === id && (
            <foreignObject
              x={(startX + endX) / 2 - 75}
              y={controlY - 40}
              width="150"
              height="100"
              className="pointer-events-none"
            >
              <div
                className={cn(
                  'bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white animate-fade-in'
                )}
                role="tooltip"
                aria-hidden={hoveredConnection !== id}
              >
                <div className="font-medium">{style.label}</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {connection.from} → {connection.to}
                </div>
                <div className="text-xs mt-1">
                  {connection.type === 'paradox'
                    ? 'Potential timeline instability'
                    : 'Influence strength: Moderate'}
                </div>
              </div>
            </foreignObject>
          )}
        </g>
      ))}
    </svg>
  );
};

// Add to your globals.css if not present
const additionalStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }
`;
