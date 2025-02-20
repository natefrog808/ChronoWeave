// Save as: src/utils/timelineUtils.ts
import {
  HistoricalEvent,
  TimelineConnection,
  TimelineEffects,
  TimelineBranch,
} from '@/types/timeline';
import { calculateDecay, clamp } from '@/lib/utils';

// Enhanced connection extraction with strength and direction
export const getEventConnections = (
  event: HistoricalEvent,
  allEvents: HistoricalEvent[],
  includeIndirect: boolean = false
): TimelineConnection[] => {
  const connections: TimelineConnection[] = [];

  // Direct effects (forward connections)
  if (event.effects) {
    event.effects.forEach((effectId) => {
      const effectEvent = allEvents.find((e) => e.id === effectId);
      if (effectEvent) {
        connections.push({
          from: event.year,
          to: effectEvent.year,
          type: 'effect',
          strength: event.strength || 0.5,
          duration: event.duration || 10,
          direction: 'forward',
        });
      }
    });
  }

  // Direct causes (backward connections)
  if (event.causedBy) {
    event.causedBy.forEach((causeId) => {
      const causeEvent = allEvents.find((e) => e.id === causeId);
      if (causeEvent) {
        connections.push({
          from: causeEvent.year,
          to: event.year,
          type: 'dependency',
          strength: causeEvent.strength || 0.5,
          duration: causeEvent.duration || 10,
          direction: 'backward',
        });
      }
    });
  }

  // Indirect connections (optional, based on tags or overlapping impacts)
  if (includeIndirect) {
    allEvents.forEach((otherEvent) => {
      if (
        otherEvent.id !== event.id &&
        !event.effects?.includes(otherEvent.id) &&
        !event.causedBy?.includes(otherEvent.id)
      ) {
        const sharedTags = (event.tags || []).filter((tag) =>
          (otherEvent.tags || []).includes(tag)
        );
        if (sharedTags.length > 0) {
          connections.push({
            from: event.year,
            to: otherEvent.year,
            type: 'indirect',
            strength: 0.2, // Low strength for indirect links
            direction: event.year < otherEvent.year ? 'forward' : 'backward',
            label: `Shared tags: ${sharedTags.join(', ')}`,
          });
        }
      }
    });
  }

  return connections;
};

// Calculate effects with decay and paradox handling
export const calculateEffects = (
  baseEffects: TimelineEffects,
  event: HistoricalEvent,
  allEvents: HistoricalEvent[],
  decayFactor: number = 20 // Half-life in years
): TimelineEffects => {
  const newEffects = { ...baseEffects };

  // Apply direct impact
  Object.entries(event.impact).forEach(([metric, value]) => {
    if (metric in newEffects) {
      newEffects[metric as keyof TimelineEffects] = clamp(
        newEffects[metric as keyof TimelineEffects] + value,
        0,
        200
      );
    } else {
      newEffects[metric] = clamp(value, 0, 200);
    }
  });

  // Propagate effects with decay
  if (event.effects) {
    event.effects.forEach((effectId) => {
      const effectEvent = allEvents.find((e) => e.id === effectId);
      if (effectEvent && effectEvent.year > event.year) {
        const timeDelta = effectEvent.year - event.year;
        Object.entries(effectEvent.impact).forEach(([metric, value]) => {
          const decayedValue = calculateDecay(value, timeDelta, decayFactor) * (event.strength || 0.5);
          if (metric in newEffects) {
            newEffects[metric as keyof TimelineEffects] = clamp(
              newEffects[metric as keyof TimelineEffects] + decayedValue,
              0,
              200
            );
          } else {
            newEffects[metric] = clamp(decayedValue, 0, 200);
          }
        });
      }
    });
  }

  return newEffects;
};

// Filter events by criteria
export const filterEvents = (
  events: HistoricalEvent[],
  filters: {
    category?: string;
    impactType?: string;
    yearRange?: [number, number];
    tags?: string[];
    branchId?: string;
  }
): HistoricalEvent[] => {
  return events.filter((event) => {
    const matchesCategory = !filters.category || event.category === filters.category;
    const matchesImpact =
      !filters.impactType || Object.keys(event.impact).includes(filters.impactType);
    const matchesYear =
      !filters.yearRange || (event.year >= filters.yearRange[0] && event.year <= filters.yearRange[1]);
    const matchesTags =
      !filters.tags || filters.tags.every((tag) => (event.tags || []).includes(tag));
    const matchesBranch = !filters.branchId || event.branchId === filters.branchId;

    return matchesCategory && matchesImpact && matchesYear && matchesTags && matchesBranch;
  });
};

// Merge effects from multiple events
export const mergeEffects = (
  baseEffects: TimelineEffects,
  events: HistoricalEvent[],
  allEvents: HistoricalEvent[]
): TimelineEffects => {
  return events.reduce((acc, event) => calculateEffects(acc, event, allEvents), { ...baseEffects });
};

// Create a new branch from existing events
export const createBranch = (
  events: HistoricalEvent[],
  branchId: string,
  parentBranchId?: string
): TimelineBranch => {
  return {
    id: branchId,
    events: events.map((event) => ({ ...event, branchId })),
    parentBranch: parentBranchId,
    createdAt: Date.now(),
    name: `Branch ${branchId}`,
  };
};

// Detect timeline anomalies (e.g., paradoxes or extreme impacts)
export const detectAnomalies = (
  events: HistoricalEvent[],
  effects: TimelineEffects
): string[] => {
  const anomalies: string[] = [];

  // Check for extreme effects
  Object.entries(effects).forEach(([metric, value]) => {
    if (value <= 10) {
      anomalies.push(`Critical low in ${metric}: ${value.toFixed(1)}%`);
    } else if (value >= 190) {
      anomalies.push(`Critical high in ${metric}: ${value.toFixed(1)}%`);
    }
  });

  // Check for paradoxes (self-referencing loops)
  const visited = new Set<number>();
  const path = new Set<number>();
  const dfs = (eventId: number) => {
    if (path.has(eventId)) {
      anomalies.push(`Paradox detected at event ${eventId}`);
      return;
    }
    if (visited.has(eventId)) return;
    visited.add(eventId);
    path.add(eventId);

    const event = events.find((e) => e.id === eventId);
    if (event?.effects) {
      event.effects.forEach(dfs);
    }
    path.delete(eventId);
  };

  events.forEach((e) => dfs(e.id));
  return anomalies;
};

// Simulate effect propagation over time (for debugging or visualization)
export const simulateTimeline = (
  initialEffects: TimelineEffects,
  events: HistoricalEvent[],
  startYear: number,
  endYear: number
): Record<number, TimelineEffects> => {
  const simulation: Record<number, TimelineEffects> = {};
  let currentEffects = { ...initialEffects };

  for (let year = startYear; year <= endYear; year++) {
    const yearEvents = events.filter((e) => e.year === year);
    if (yearEvents.length > 0) {
      currentEffects = mergeEffects(currentEffects, yearEvents, events);
    }
    simulation[year] = { ...currentEffects };
  }

  return simulation;
};
