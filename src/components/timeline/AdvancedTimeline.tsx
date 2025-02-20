// Save as: src/components/timeline/AdvancedTimeline.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { cn, formatYear, detectParadoxes as utilsDetectParadoxes } from '@/lib/utils';
import {
  getEventConnections,
  calculateEffects,
  filterEvents,
  createBranch,
  detectAnomalies,
  simulateTimeline,
} from '@/utils/timelineUtils';
import { EffectsPanel } from './EffectsPanel';
import { TimelineConnections } from './TimelineConnections';
import { TimelineLegend } from './TimelineLegend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import {
  HistoricalEvent,
  TimelineConnection,
  TimelineEffects,
  TimelineBranch,
  Category,
  ImpactType,
} from '@/types/timeline';
import { TimelineProps } from '@/types/components';
import { historicalEvents, categories, impactTypes } from '@/data/timelineData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

// Custom hook for timeline simulation
const useTimelineSimulation = (initialEvents: HistoricalEvent[], initialBranchId: string) => {
  const [state, setState] = useState<{
    currentYear: number;
    effects: TimelineEffects;
    timelineEvents: HistoricalEvent[];
    branchId: string;
  }>({
    currentYear: Number(process.env.NEXT_PUBLIC_TIMELINE_BASE_YEAR) || 1800,
    effects: { economy: 100, society: 100, technology: 100, education: 100, health: 100 },
    timelineEvents: initialEvents,
    branchId: initialBranchId,
  });

  const propagateEffects = useCallback(
    (event: HistoricalEvent) => {
      setState((prev) => ({
        ...prev,
        effects: calculateEffects(
          prev.effects,
          event,
          prev.timelineEvents,
          Number(process.env.NEXT_PUBLIC_DEFAULT_DECAY_FACTOR) || 20
        ),
      }));
    },
    [setState]
  );

  const setCurrentYear = useCallback(
    (year: number) => {
      setState((prev) => ({ ...prev, currentYear: year }));
      const event = state.timelineEvents.find((e) => e.year === year);
      if (event) propagateEffects(event);
    },
    [propagateEffects, state.timelineEvents]
  );

  return { ...state, setCurrentYear, setState };
};

const AdvancedTimeline: React.FC<TimelineProps> = ({
  showConnections = true,
  enableZoom = process.env.NEXT_PUBLIC_ENABLE_ZOOM === 'true',
  allowFiltering = true,
  interactive = true,
  initialYear = Number(process.env.NEXT_PUBLIC_TIMELINE_BASE_YEAR) || 1800,
  yearRange = Number(process.env.NEXT_PUBLIC_TIMELINE_YEAR_RANGE) || 50,
  pixelsPerYear = Number(process.env.NEXT_PUBLIC_PIXELS_PER_YEAR) || 4,
  events = historicalEvents,
  branches: initialBranches,
  onBranchChange,
  onYearChange,
  className,
}) => {
  const { theme, updateTheme } = useTheme();
  const [activeBranch, setActiveBranch] = useState('main');
  const [branches, setBranches] = useState<Map<string, TimelineBranch>>(
    initialBranches || new Map([['main', { id: 'main', events, createdAt: Date.now(), name: 'Main Timeline' }]])
  );
  const { currentYear, effects, setCurrentYear, setState } = useTimelineSimulation(
    branches.get(activeBranch)?.events || events,
    activeBranch
  );
  const [hoveredEvent, setHoveredEvent] = useState<HistoricalEvent | null>(null);
  const [highlightedConnections, setHighlightedConnections] = useState<TimelineConnection[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterImpact, setFilterImpact] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDebug, setShowDebug] = useState(process.env.NEXT_PUBLIC_SHOW_DEBUG_PANEL === 'true');

  const baseYear = initialYear;
  const endYear = baseYear + yearRange - 1;
  const timelineWidth = yearRange * pixelsPerYear * zoomLevel;

  const filteredEvents = useMemo(
    () =>
      filterEvents(branches.get(activeBranch)?.events || events, {
        category: filterCategory,
        impactType: filterImpact,
        yearRange: [baseYear, endYear],
      }),
    [filterCategory, filterImpact, branches, activeBranch, baseYear, endYear, events]
  );

  const paradoxes = useMemo(
    () => utilsDetectParadoxes(branches.get(activeBranch)?.events || events),
    [branches, activeBranch, events]
  );

  const anomalies = useMemo(
    () => detectAnomalies(filteredEvents, effects),
    [filteredEvents, effects]
  );

  const simulation = useMemo(
    () => simulateTimeline({ economy: 100, society: 100, technology: 100, education: 100, health: 100 }, filteredEvents, baseYear, endYear),
    [filteredEvents, baseYear, endYear]
  );

  useEffect(() => {
    onBranchChange?.(activeBranch);
    onYearChange?.(currentYear);
  }, [activeBranch, currentYear, onBranchChange, onYearChange]);

  const handleEventHover = (event: HistoricalEvent | null) => {
    setHoveredEvent(event);
    if (event && interactive) {
      setHighlightedConnections(getEventConnections(event, filteredEvents, true));
    } else {
      setHighlightedConnections([]);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilterCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleImpactToggle = (impactId: string) => {
    setFilterImpact((prev) => (prev === impactId ? null : impactId));
  };

  const handleZoom = (delta: number) => {
    if (enableZoom) {
      setZoomLevel((prev) => clamp(prev + delta, 0.5, 2));
    }
  };

  const createNewBranch = () => {
    const newBranchId = `branch-${Date.now()}`;
    const newBranch = createBranch(filteredEvents, newBranchId, activeBranch);
    setBranches((prev) => new Map(prev).set(newBranchId, newBranch));
    setActiveBranch(newBranchId);
  };

  const renderEventMarker = (event: HistoricalEvent) => {
    const category = categories.find((c) => c.id === event.category);
    const leftPosition = scaleYearToPixels(event.year, baseYear, pixelsPerYear * zoomLevel);

    return (
      <motion.div
        key={event.id}
        className="absolute -top-20 focus:outline-none event-hover"
        style={{ left: `${leftPosition}px` }}
        onMouseEnter={() => handleEventHover(event)}
        onMouseLeave={() => handleEventHover(null)}
        onFocus={() => handleEventHover(event)}
        onBlur={() => handleEventHover(null)}
        tabIndex={interactive ? 0 : -1}
        role="button"
        aria-label={`Event: ${event.event} in ${formatYear(event.year)}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div
            className={cn(
              `w-2 h-event-marker ${category?.color || 'bg-gray-500'} mx-auto transition-all`,
              hoveredEvent?.id === event.id && 'h-10'
            )}
          />
          {hoveredEvent?.id === event.id && (
            <Card
              className="absolute bottom-full mb-1 w-48 -left-24 bg-white dark:bg-gray-800 shadow-lg"
              variant="temporal"
              glow="subtle"
            >
              <CardContent className="p-2 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">{event.event}</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">{event.description}</div>
                <div className="mt-2 space-y-1">
                  {Object.entries(event.impact).map(([metric, value]) => (
                    <div key={metric} className="flex items-center gap-2">
                      <span className="capitalize text-xs w-20 text-gray-700 dark:text-gray-200">
                        {metric}:
                      </span>
                      <div
                        className={cn(
                          'text-xs font-medium',
                          value > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {value > 0 ? '+' : ''}{value}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTimeline = () => {
    const timelineRange = Array.from({ length: yearRange }, (_, i) => baseYear + i);

    return (
      <Card variant="temporal" glow="subtle" className="overflow-hidden">
        <CardContent className="p-0">
          <div
            className="relative w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto"
            role="region"
            aria-label="Historical Timeline"
            style={{ width: `${timelineWidth}px` }}
          >
            {showConnections && (
              <TimelineConnections
                connections={highlightedConnections}
                containerWidth={timelineWidth}
                containerHeight={100}
                baseYear={baseYear}
              />
            )}
            <div className="h-48 relative">
              {timelineRange.map((year) => (
                <motion.div
                  key={year}
                  className={cn(
                    'inline-block mx-1 h-16 w-2 cursor-pointer transition-all',
                    year === currentYear ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700',
                    interactive && 'hover:bg-blue-300 dark:hover:bg-blue-500'
                  )}
                  style={{ width: `${pixelsPerYear * zoomLevel}px` }}
                  onClick={() => interactive && setCurrentYear(year)}
                  onKeyPress={(e) => interactive && e.key === 'Enter' && setCurrentYear(year)}
                  tabIndex={interactive ? 0 : -1}
                  role="button"
                  aria-label={`Jump to ${formatYear(year)}`}
                  aria-current={year === currentYear ? 'true' : 'false'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
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
        </CardContent>
      </Card>
    );
  };

  const renderControls = () => (
    <Card variant="temporal" glow="subtle" className="mb-4">
      <CardContent className="flex flex-wrap gap-4 p-4">
        {allowFiltering && (
          <>
            <Select value={filterCategory || ''} onValueChange={(value) => setFilterCategory(value || null)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterImpact || ''} onValueChange={(value) => setFilterImpact(value || null)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Impacts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Impacts</SelectItem>
                {impactTypes.map((imp) => (
                  <SelectItem key={imp.id} value={imp.id}>
                    {imp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        <Select value={activeBranch} onValueChange={setActiveBranch}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(branches.keys()).map((branchId) => (
              <SelectItem key={branchId} value={branchId}>
                {branches.get(branchId)?.name || branchId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={createNewBranch} variant="default" className="bg-primary hover:bg-primary/90">
          Create Branch
        </Button>
        <Select value={theme} onValueChange={updateTheme}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="past">Past</SelectItem>
            <SelectItem value="future">Future</SelectItem>
            <SelectItem value="paradox">Paradox</SelectItem>
          </SelectContent>
        </Select>
        {enableZoom && (
          <>
            <Button onClick={() => handleZoom(0.1)} variant="outline">
              Zoom In
            </Button>
            <Button onClick={() => handleZoom(-0.1)} variant="outline">
              Zoom Out
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderDebugPanel = () => (
    <Card variant="temporal" className="mt-4">
      <CardHeader>
        <CardTitle>Debug Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p><strong>Current Year:</strong> {formatYear(currentYear)}</p>
          <p><strong>Active Branch:</strong> {branches.get(activeBranch)?.name || activeBranch}</p>
          <p><strong>Zoom Level:</strong> {zoomLevel.toFixed(2)}x</p>
          <p><strong>Filtered Events:</strong> {filteredEvents.length}</p>
          <p><strong>Paradoxes:</strong> {paradoxes.length > 0 ? paradoxes.join(', ') : 'None'}</p>
          <p><strong>Anomalies:</strong> {anomalies.length > 0 ? anomalies.join(', ') : 'None'}</p>
          <details>
            <summary>Simulation State</summary>
            <pre className="text-xs">{JSON.stringify(simulation[currentYear], null, 2)}</pre>
          </details>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn('p-4 max-w-4xl mx-auto', className)}>
      {paradoxes.length > 0 && (
        <motion.div
          className="bg-temporal-paradox-100 dark:bg-temporal-paradox-900 p-2 rounded mb-4 text-temporal-paradox-700 dark:text-temporal-paradox-200"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {paradoxes.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </motion.div>
      )}
      <motion.div
        className="text-2xl font-bold text-foreground mb-4 font-temporal"
        aria-live="polite"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {formatYear(currentYear)} - {branches.get(activeBranch)?.name || activeBranch}
      </motion.div>
      {renderControls()}
      {renderTimeline()}
      <EffectsPanel effects={effects} year={currentYear} />
      <TimelineLegend
        filteredEvents={filteredEvents}
        categories={categories}
        impactTypes={impactTypes}
        onCategoryToggle={handleCategoryToggle}
        onImpactToggle={handleImpactToggle}
      />
      {showDebug && renderDebugPanel()}
    </div>
  );
};

export default AdvancedTimeline;
