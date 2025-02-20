// Save as: src/components/timeline/TimelineConnections.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimelineConnection } from '@/types/timeline';
import { cn, scaleYearToPixels } from '@/lib/utils';

interface TimelineConnectionsProps {
  connections: TimelineConnection[];
  containerWidth: number;
  containerHeight?: number;
  baseYear?: number;
  className?: string;
}

export const TimelineConnections: React.FC<TimelineConnectionsProps> = ({
  connections,
  containerWidth,
  containerHeight = 100,
  baseYear = 1800,
  className
}) => {
  // Memoize path calculations for performance
  const paths = useMemo(() => {
    return connections.map((connection, index) => {
      // Calculate start and end points
      const startX = scaleYearToPixels(connection.from, baseYear);
      const endX = scaleYearToPixels(connection.to, baseYear);
      const midY = containerHeight / 2;
      
      // Control points for smooth curve
      const controlY = connection.type === 'paradox' ? midY * 1.5 : midY;
      const curve = `M ${startX} 0 
                     C ${startX} ${controlY}, 
                       ${endX} ${controlY}, 
                       ${endX} ${containerHeight}`;

      // Define connection styles based on type
      const styles = {
        paradox: {
          stroke: '#ef4444', // red
          dasharray: '5,5',
          opacity: 0.8
        },
        effect: {
          stroke: '#3b82f6', // blue
          dasharray: 'none',
          opacity: 0.6
        },
        dependency: {
          stroke: '#8b5cf6', // purple
          dasharray: '3,3',
          opacity: 0.6
        },
        indirect: {
          stroke: '#6b7280', // gray
          dasharray: '2,4',
          opacity: 0.4
        }
      };

      const style = styles[connection.type] || styles.effect;

      return {
        id: `connection-${index}`,
        path: curve,
        ...style,
        strength: connection.strength || 0.5,
        direction: connection.direction || 'forward',
        label: connection.label
      };
    });
  }, [connections, containerWidth, containerHeight, baseYear]);

  return (
    <svg
      className={cn('absolute top-0 left-0 pointer-events-none', className)}
      width={containerWidth}
      height={containerHeight}
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        {/* Arrow marker definitions */}
        <marker
          id="arrow-forward"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
        <marker
          id="arrow-backward"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 5 L 10 0 L 10 10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* Render connection paths */}
      {paths.map((pathData) => (
        <g key={pathData.id} className="connection-group">
          <motion.path
            d={pathData.path}
            stroke={pathData.stroke}
            strokeWidth={Math.max(1, pathData.strength * 3)}
            strokeDasharray={pathData.dasharray}
            fill="none"
            opacity={pathData.opacity}
            markerEnd={pathData.direction !== 'backward' ? 'url(#arrow-forward)' : undefined}
            markerStart={pathData.direction !== 'forward' ? 'url(#arrow-backward)' : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: pathData.opacity }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Optional connection label */}
          {pathData.label && (
            <motion.text
              x="50%"
              y="50%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
            >
              {pathData.label}
            </motion.text>
          )}
        </g>
      ))}
    </svg>
  );
};
