// Save as: src/data/timelineData.ts
import { HistoricalEvent, Category, ImpactType } from '@/types/timeline';

// Extended Category Definitions
export const categories: Category[] = [
  { id: 'technological', label: 'Technological', color: 'bg-blue-500' },
  { id: 'social', label: 'Social', color: 'bg-green-500' },
  { id: 'political', label: 'Political', color: 'bg-purple-500' },
  { id: 'economic', label: 'Economic', color: 'bg-amber-500' },
  { id: 'environmental', label: 'Environmental', color: 'bg-teal-500' },
  { id: 'cultural', label: 'Cultural', color: 'bg-pink-500' },
];

// Extended Impact Type Definitions
export const impactTypes: ImpactType[] = [
  { id: 'economy', label: 'Economic Impact', color: 'bg-emerald-500' },
  { id: 'society', label: 'Social Impact', color: 'bg-indigo-500' },
  { id: 'technology', label: 'Technological Impact', color: 'bg-rose-500' },
  { id: 'education', label: 'Educational Impact', color: 'bg-cyan-500' },
  { id: 'health', label: 'Health Impact', color: 'bg-orange-500' },
  { id: 'environment', label: 'Environmental Impact', color: 'bg-lime-500' },
  { id: 'culture', label: 'Cultural Impact', color: 'bg-fuchsia-500' },
];

// Enhanced Historical Events with Additional Metadata
export const historicalEvents: HistoricalEvent[] = [
  {
    id: 1,
    year: 1800,
    event: 'Industrial Revolution Peak',
    description: 'Steam power and mechanized manufacturing transform society',
    impact: { economy: 30, technology: 40, society: -20, environment: -15 },
    effects: [2, 4, 6],
    category: 'technological',
    strength: 0.9, // Influence strength (0-1)
    duration: 50, // Years of impact
    tags: ['industrialization', 'steam-power'],
  },
  {
    id: 2,
    year: 1807,
    event: 'Abolition of Slave Trade',
    description: 'British Parliament passes the Slave Trade Act',
    impact: { society: 50, economy: -10, culture: 15 },
    effects: [5, 7],
    causedBy: [1],
    category: 'social',
    strength: 0.7,
    duration: 30,
    tags: ['abolition', 'human-rights'],
  },
  {
    id: 3,
    year: 1815,
    event: 'Battle of Waterloo',
    description: "Napoleon's final defeat reshapes European politics",
    impact: { society: 20, economy: -15, political: 25 },
    effects: [8],
    category: 'political',
    strength: 0.6,
    duration: 20,
    tags: ['war', 'napoleon'],
  },
  {
    id: 4,
    year: 1825,
    event: 'First Public Railway',
    description: 'Stockton and Darlington Railway begins operation',
    impact: { technology: 35, economy: 25, society: 10 },
    effects: [9],
    causedBy: [1],
    category: 'technological',
    strength: 0.8,
    duration: 40,
    tags: ['railway', 'transportation'],
  },
  {
    id: 5,
    year: 1833,
    event: 'Slavery Abolition Act',
    description: 'Complete abolition of slavery throughout the British Empire',
    impact: { society: 40, economy: -5, culture: 20 },
    effects: [10],
    causedBy: [2],
    category: 'social',
    strength: 0.75,
    duration: 25,
    tags: ['slavery', 'emancipation'],
  },
  {
    id: 6,
    year: 1830,
    event: 'July Revolution',
    description: 'French uprising establishes a constitutional monarchy',
    impact: { political: 30, society: 15, economy: -10 },
    effects: [11],
    causedBy: [1], // Indirectly influenced by industrial unrest
    category: 'political',
    strength: 0.65,
    duration: 15,
    tags: ['revolution', 'france'],
  },
  {
    id: 7,
    year: 1834,
    event: 'Poor Law Amendment Act',
    description: 'Reforms welfare system in Britain, impacting the poor',
    impact: { society: -25, economy: 10 },
    effects: [],
    causedBy: [2],
    category: 'social',
    strength: 0.5,
    duration: 20,
    tags: ['welfare', 'poverty'],
  },
  {
    id: 8,
    year: 1819,
    event: 'Peterloo Massacre',
    description: 'Cavalry charges into a crowd demanding reform',
    impact: { society: -20, political: 15 },
    effects: [],
    causedBy: [3], // Political unrest post-Waterloo
    category: 'political',
    strength: 0.55,
    duration: 10,
    tags: ['protest', 'reform'],
  },
  {
    id: 9,
    year: 1831,
    event: 'Faraday’s Electromagnetic Discovery',
    description: 'Michael Faraday demonstrates electromagnetic induction',
    impact: { technology: 45, economy: 15 },
    effects: [12],
    causedBy: [4],
    category: 'technological',
    strength: 0.85,
    duration: 60,
    tags: ['electricity', 'science'],
  },
  {
    id: 10,
    year: 1840,
    event: 'Factory Act',
    description: 'Limits child labor and improves working conditions',
    impact: { society: 25, economy: -5, health: 15 },
    effects: [],
    causedBy: [5],
    category: 'social',
    strength: 0.6,
    duration: 30,
    tags: ['labor', 'reform'],
  },
  {
    id: 11,
    year: 1836,
    event: 'Chartist Movement Begins',
    description: 'Working-class demand for political reform in Britain',
    impact: { political: 20, society: 15 },
    effects: [],
    causedBy: [6],
    category: 'political',
    strength: 0.7,
    duration: 20,
    tags: ['democracy', 'working-class'],
  },
  {
    id: 12,
    year: 1848,
    event: 'Revolutions of 1848',
    description: 'Wave of revolutions across Europe',
    impact: { political: 35, society: 20, economy: -15 },
    effects: [],
    causedBy: [9], // Technological advances fuel unrest
    category: 'political',
    strength: 0.8,
    duration: 15,
    tags: ['revolution', 'europe'],
  },
];

// Utility function to validate data consistency
export const validateTimelineData = (): string[] => {
  const errors: string[] = [];
  const eventIds = new Set<number>();
  
  historicalEvents.forEach((event) => {
    // Check for duplicate IDs
    if (eventIds.has(event.id)) {
      errors.push(`Duplicate event ID: ${event.id}`);
    }
    eventIds.add(event.id);

    // Validate category exists
    if (!categories.some((cat) => cat.id === event.category)) {
      errors.push(`Invalid category '${event.category}' for event ${event.id}`);
    }

    // Validate impact keys
    Object.keys(event.impact).forEach((impact) => {
      if (!impactTypes.some((imp) => imp.id === impact)) {
        errors.push(`Invalid impact type '${impact}' for event ${event.id}`);
      }
    });

    // Check effects and causedBy references
    const checkReferences = (ids: number[] | undefined, type: string) => {
      if (ids) {
        ids.forEach((refId) => {
          if (!historicalEvents.some((e) => e.id === refId)) {
            errors.push(`${type} reference to unknown event ID ${refId} in event ${event.id}`);
          }
        });
      }
    };
    checkReferences(event.effects, 'effects');
    checkReferences(event.causedBy, 'causedBy');
  });

  return errors;
};

// Run validation on load (for development)
if (process.env.NODE_ENV === 'development') {
  const validationErrors = validateTimelineData();
  if (validationErrors.length > 0) {
    console.warn('Timeline Data Validation Errors:', validationErrors);
  }
}
