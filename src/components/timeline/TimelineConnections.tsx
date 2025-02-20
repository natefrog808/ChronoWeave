// src/components/timeline/TimelineConnections.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimelineConnection } from '@/types/timeline';
import { cn } from '@/lib/utils';

interface TimelineConnectionsProps {
  connections: TimelineConnection[];
  containerWidth: number;
  containerHeight?: number;
  baseYear?: number;
  className?: string;
}

// Calculate start and end points for a curved path
const calculateCurvedPath = (
  startX: number,
  endX: number,
  height: number,
  type: TimelineConnection['type']
) => {
  const midY = height / 2;
  const controlY = type === 'paradox' ? midY * 1.5 : midY;
  return `M ${startX} 0 C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${height}`;
};

export const TimelineConnections: React.FC<TimelineConnectionsProps> = ({
  connections,
  containerWidth,
  containerHeight = 100,
  baseYear = 1800,
  className
}) => {
  const paths = useMemo(() => {
    return connections.map((connection, index) => {
      // Calculate start and end points based on years
      const startX = ((connection.from - baseYear) * containerWidth) / 50;
      const endX = ((connection.to - baseYear) * containerWidth) / 50;

      // Define styles for different connection types
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
      const path = calculateCurvedPath(startX, endX, containerHeight, connection.type);

      return {
        id: `connection-${index}`,
        path,
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
        {/* Forward arrow marker */}
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
        {/* Backward arrow marker */}
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

      {paths.map((pathData) => (
        <g key={pathData.id} className="connection-group">
          {/* Connection path */}
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
          
          {/* Connection label */}
          {pathData.label && (
            <motion.text
              x="50%"
              y="50%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs font-medium pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
            >
              <textPath href={`#${pathData.id}`} startOffset="50%">
                {pathData.label}
              </textPath>
            </motion.text>
          )}

          {/* Hover effect highlight */}
          <motion.path
            d={pathData.path}
            stroke="transparent"
            strokeWidth={Math.max(10, pathData.strength * 10)}
            fill="none"
            className="cursor-pointer"
            onMouseEnter={() => {
              const path = document.querySelector(`#${pathData.id}`);
              if (path) path.classList.add('connection-hover');
            }}
            onMouseLeave={() => {
              const path = document.querySelector(`#${pathData.id}`);
              if (path) path.classList.remove('connection-hover');
            }}
          />
        </g>
      ))}
    </svg>
  );
};

export default TimelineConnections;
