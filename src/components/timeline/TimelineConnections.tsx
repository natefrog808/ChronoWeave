// Save as: src/components/timeline/TimelineConnections.tsx

import React from 'react';
import { TimelineConnection } from '@/types/timeline';

interface TimelineConnectionsProps {
  connections: TimelineConnection[];
}

export const TimelineConnections: React.FC<TimelineConnectionsProps> = ({ connections }) => {
  return (
    <>
      {connections.map((connection, index) => {
        const startX = (connection.from - 1800) * 4;
        const endX = (connection.to - 1800) * 4;
        const width = Math.abs(endX - startX);
        const left = Math.min(startX, endX);
        
        return (
          <div
            key={index}
            className={`absolute h-1 transition-all duration-300 ${
              connection.type === 'effect' ? 'bg-blue-400' : 'bg-purple-400'
            }`}
            style={{
              width: `${width}px`,
              left: `${left}px`,
              top: '50%',
              opacity: 0.6,
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          />
        );
      })}
    </>
  );
};
