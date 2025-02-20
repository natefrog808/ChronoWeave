import React, { useState, useMemo, useCallback, useEffect } from 'react';

interface HistoricalEvent {
  id: number;
  year: number;
  event: string;
  description: string;
  impact: Record<string, number>;
  effects?: number[];
  causedBy?: number[];
  category: string;
}

interface TimelineState {
  currentYear: number;
  effects: Record<string, number>;
  timelineEvents: HistoricalEvent[];
  branchId: string; // For tracking alternate timelines
}

interface Category {
  id: string;
  label: string;
  color: string;
}

interface ImpactType {
  id: string;
  label: string;
  color: string;
}

// Custom hook for timeline simulation
const useTimelineSimulation = (initialEvents: HistoricalEvent[], branchId: string) => {
  const [state, setState] = useState<TimelineState>({
    currentYear: 1800,
    effects: { economy: 100, society: 100, technology: 100, education: 100, health: 100 },
    timelineEvents: initialEvents,
    branchId,
  });

  const propagateEffects = useCallback((event: HistoricalEvent) => {
    setState((prev) => {
      const newEffects = { ...prev.effects };
      Object.entries(event.impact).forEach(([metric, value]) => {
        if (metric in newEffects) {
          newEffects[metric] = Math.max(0, Math.min(200, newEffects[metric] + value));
        }
      });

      // Ripple effects with decay
      if (event.effects) {
        event.effects.forEach((effectId) => {
          const nextEvent = prev.timelineEvents.find((e) => e.id === effectId);
          if (nextEvent && nextEvent.year > event.year) {
            Object.entries(nextEvent.impact).forEach(([metric, value]) => {
              const decay = Math.exp(-(nextEvent.year - event.year) / 20); // Exponential decay over 20 years
              newEffects[metric] += value * decay;
            });
          }
        });
      }
      return { ...prev, effects: newEffects };
    });
  }, []);

  const setCurrentYear = useCallback((year: number) => {
    setState((prev) => ({ ...prev, currentYear: year }));
    const event = state.timelineEvents.find((e) => e.year === year);
    if (event) propagateEffects(event);
  }, [propagateEffects, state.timelineEvents]);

  return { ...state, setCurrentYear, setState };
};

// Paradox detection utility
const detectParadoxes = (events: HistoricalEvent[]): string[] => {
  const paradoxes: string[] = [];
  const visited = new Set<number>();
  const path = new Set<number>();

  const dfs = (eventId: number) => {
    if (path.has(eventId)) {
      paradoxes.push(`Circular dependency detected at event ${eventId}`);
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
  return paradoxes;
};

const AdvancedTimeline: React.FC = () => {
  const historicalEvents: HistoricalEvent[] = useMemo(
    () => [
      {
        id: 1,
        year: 1800,
        event: "Industrial Revolution Peak",
        description: "Steam power and mechanized manufacturing transform society",
        impact: { economy: 30, technology: 40, society: -20 },
        effects: [2, 4],
        category: "technological",
      },
      {
        id: 2,
        year: 1807,
        event: "Abolition of Slave Trade",
        description: "British Parliament passes the Slave Trade Act",
        impact: { society: 50, economy: -10 },
        effects: [5],
        causedBy: [1],
        category: "social",
      },
      {
        id: 3,
        year: 1815,
        event: "Battle of Waterloo",
        description: "Napoleon's final defeat reshapes European politics",
        impact: { society: 20, economy: -15 },
        effects: [],
        category: "political",
      },
      {
        id: 4,
        year: 1820,
        event: "Textile Industry Boom",
        description: "Mass production of textiles accelerates urbanization",
        impact: { economy: 25, society: 10, technology: 15 },
        effects: [],
        causedBy: [1],
        category: "economic",
      },
      {
        id: 5,
        year: 1830,
        event: "Public Education Reform",
        description: "Education becomes more accessible due to societal shifts",
        impact: { education: 30, society: 15 },
        effects: [],
        causedBy: [2],
        category: "social",
      },
    ],
    []
  );

  const [activeBranch, setActiveBranch] = useState("main");
  const [branches, setBranches] = useState<Map<string, HistoricalEvent[]>>(new Map([["main", historicalEvents]]));
  
  const { currentYear, effects, setCurrentYear, setState } = useTimelineSimulation(
    branches.get(activeBranch) || historicalEvents,
    activeBranch
  );
  
  const [hoveredEvent, setHoveredEvent] = useState<HistoricalEvent | null>(null);
  const [highlightedConnections, setHighlightedConnections] = useState<
    { from: number; to: number; type: string }[]
  >([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterImpact, setFilterImpact] = useState<string | null>(null);

  const categories: Category[] = [
    { id: "technological", label: "Technological", color: "bg-blue-500" },
    { id: "social", label: "Social", color: "bg-green-500" },
    { id: "political", label: "Political", color: "bg-purple-500" },
    { id: "economic", label: "Economic", color: "bg-amber-500" },
  ];

  const impactTypes: ImpactType[] = [
    { id: "economy", label: "Economic Impact", color: "bg-emerald-500" },
    { id: "society", label: "Social Impact", color: "bg-indigo-500" },
    { id: "technology", label: "Technological Impact", color: "bg-rose-500" },
    { id: "education", label: "Educational Impact", color: "bg-teal-500" },
    { id: "health", label: "Health Impact", color: "bg-orange-500" },
  ];

  const paradoxes = useMemo(() => detectParadoxes(branches.get(activeBranch) || historicalEvents), [branches, activeBranch]);

  // Filter events based on category and impact
  const getFilteredEvents = useCallback(() => {
    const events = branches.get(activeBranch) || historicalEvents;
    return events.filter((event) => {
      const categoryMatch = !filterCategory || event.category === filterCategory;
      const impactMatch = !filterImpact || Object.keys(event.impact).includes(filterImpact);
      return categoryMatch && impactMatch;
    });
  }, [filterCategory, filterImpact, branches, activeBranch]);

  // Handle branching
  const createBranch = () => {
    const newBranchId = `branch-${Date.now()}`;
    setBranches((prev) => new Map(prev).set(newBranchId, [...(branches.get(activeBranch) || historicalEvents)]));
    setActiveBranch(newBranchId);
  };

  // Handle event hover for connections
  const handleEventHover = (event: HistoricalEvent | null) => {
    setHoveredEvent(event);
    if (event?.effects) {
      const connections = event.effects.map((effectId) => {
        const effectEvent = historicalEvents.find((e) => e.id === effectId);
        return effectEvent ? { from: event.year, to: effectEvent.year, type: "effect" } : null;
      }).filter(Boolean) as { from: number; to: number; type: string }[];
      setHighlightedConnections(connections);
    } else {
      setHighlightedConnections([]);
    }
  };

  // Render SVG connections
  const renderConnections = () => (
    <svg className="absolute inset-0 pointer-events-none" style={{ height: "100px", zIndex: 0 }}>
      {highlightedConnections.map((conn, i) => (
        <path
          key={i}
          d={`M${(conn.from - 1800) * 4},${80} Q${((conn.from + conn.to) / 2 - 1800) * 4},${20} ${(conn.to - 1800) * 4},${80}`}
          fill="none"
          stroke="rgba(59, 130, 246, 0.5)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      ))}
    </svg>
  );

  // Render individual event markers
  const renderEventMarker = (event: HistoricalEvent) => {
    const category = categories.find((c) => c.id === event.category);
    return (
      <div
        key={event.id}
        className="absolute -top-20 focus:outline-none"
        style={{ left: `${(event.year - 1800) * 4}px` }}
        onMouseEnter={() => handleEventHover(event)}
        onMouseLeave={() => handleEventHover(null)}
        onFocus={() => handleEventHover(event)}
        onBlur={() => handleEventHover(null)}
        tabIndex={0}
        role="button"
        aria-label={`Event: ${event.event} in ${event.year}`}
      >
        <div className="relative">
          <div className={`w-2 h-8 ${category?.color || "bg-gray-500"} mx-auto transition-all hover:h-10`} />
          {hoveredEvent?.id === event.id && (
            <div
              className="absolute bottom-full mb-1 w-48 -left-24 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm transition-opacity duration-200"
              role="tooltip"
            >
              <div className="font-medium text-gray-900 dark:text-white">{event.event}</div>
              <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">{event.description}</div>
              <div className="mt-2 space-y-1">
                {Object.entries(event.impact).map(([metric, value]) => (
                  <div key={metric} className="flex items-center gap-2">
                    <span className="capitalize text-xs w-20 text-gray-700 dark:text-gray-200">{metric}:</span>
                    <div
                      className={`text-xs font-medium ${
                        value > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {value > 0 ? "+" : ""}{value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the timeline
  const renderTimeline = () => {
    const timelineRange = Array.from({ length: 50 }, (_, i) => 1800 + i);
    const filteredEvents = getFilteredEvents();

    return (
      <div
        className="relative w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto"
        role="region"
        aria-label="Historical Timeline"
      >
        {renderConnections()}
        <div className="h-48 relative">
          {timelineRange.map((year) => (
            <div
              key={year}
              className={`inline-block mx-1 h-16 w-2 cursor-pointer transition-all ${
                year === currentYear
                  ? "bg-blue-500 dark:bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-700"
              } hover:bg-blue-300 dark:hover:bg-blue-500`}
              onClick={() => setCurrentYear(year)}
              onKeyPress={(e) => e.key === "Enter" && setCurrentYear(year)}
              tabIndex={0}
              role="button"
              aria-label={`Jump to year ${year}`}
              aria-current={year === currentYear ? "true" : "false"}
            />
          ))}
          {filteredEvents.map(renderEventMarker)}
        </div>
        {filteredEvents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No events match the current filters.
          </div>
        )}
      </div>
    );
  };

  // Render effects dashboard
  const renderEffects = () => (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Timeline Effects</h3>
      <div className="space-y-4">
        {Object.entries(effects).map(([metric, value]) => (
          <div key={metric} className="flex items-center gap-2">
            <span className="capitalize w-24 text-gray-700 dark:text-gray-200">{metric}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-4 rounded-full relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  value > 100 ? "bg-green-500 dark:bg-green-400" : "bg-red-500 dark:bg-red-400"
                }`}
                style={{ width: `${Math.min(Math.max(value, 0), 200)}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={200}
                aria-label={`${metric} effect: ${value.toFixed(1)}%`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white dark:text-gray-900">
                  {value.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render filters and controls
  const renderControls = () => (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        value={filterCategory || ""}
        onChange={(e) => setFilterCategory(e.target.value || null)}
        className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>
      <select
        value={filterImpact || ""}
        onChange={(e) => setFilterImpact(e.target.value || null)}
        className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        aria-label="Filter by impact type"
      >
        <option value="">All Impacts</option>
        {impactTypes.map((impact) => (
          <option key={impact.id} value={impact.id}>
            {impact.label}
          </option>
        ))}
      </select>
      <select
        value={activeBranch}
        onChange={(e) => setActiveBranch(e.target.value)}
        className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        aria-label="Select timeline branch"
      >
        {Array.from(branches.keys()).map((branchId) => (
          <option key={branchId} value={branchId}>
            {branchId === "main" ? "Main Timeline" : branchId}
          </option>
        ))}
      </select>
      <button
        onClick={createBranch}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        aria-label="Create new timeline branch"
      >
        Create Branch
      </button>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {paradoxes.length > 0 && (
        <div
          className="bg-red-100 dark:bg-red-900 p-2 rounded mb-4 text-red-700 dark:text-red-200"
          role="alert"
        >
          {paradoxes.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </div>
      )}
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4" aria-live="polite">
        {currentYear} - {activeBranch === "main" ? "Main Timeline" : activeBranch}
      </div>
      {renderControls()}
      {renderTimeline()}
      {renderEffects()}
    </div>
  );
};

export default AdvancedTimeline;
