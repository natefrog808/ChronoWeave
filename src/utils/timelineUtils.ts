// Save as: src/utils/timelineUtils.ts

import { HistoricalEvent, TimelineConnection, TimelineEffects } from '@/types/timeline';

export const getEventConnections = (
  event: HistoricalEvent,
  allEvents: HistoricalEvent[]
): TimelineConnection[] => {
  const connections: TimelineConnection[] = [];

  if (event.effects) {
    event.effects.forEach(effectId => {
      const effectEvent = allEvents.find(e => e.id === effectId);
      if (effectEvent) {
        connections.push({
          from: event.year,
          to: effectEvent.year,
          type: 'effect'
        });
      }
    });
  }

  if (event.causedBy) {
    event.causedBy.forEach(causeId => {
      const causeEvent = allEvents.find(e => e.id === causeId);
      if (causeEvent) {
        connections.push({
          from: causeEvent.year,
          to: event.year,
          type: 'cause'
        });
      }
    });
  }

  return connections;
};

export const calculateEffects = (
  baseEffects: TimelineEffects,
  event: HistoricalEvent
): TimelineEffects => {
  const newEffects = { ...baseEffects };
  
  Object.entries(event.impact).forEach(([metric, value]) => {
    if (metric in newEffects) {
      newEffects[metric as keyof TimelineEffects] += value;
    }
  });

  return newEffects;
};
