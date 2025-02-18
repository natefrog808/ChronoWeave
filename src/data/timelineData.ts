// Save as: src/data/timelineData.ts

import { HistoricalEvent, Category, ImpactType } from '@/types/timeline';

export const categories: Category[] = [
  { id: 'technological', label: 'Technological', color: 'bg-blue-500' },
  { id: 'social', label: 'Social', color: 'bg-green-500' },
  { id: 'political', label: 'Political', color: 'bg-purple-500' },
  { id: 'economic', label: 'Economic', color: 'bg-amber-500' }
];

export const impactTypes: ImpactType[] = [
  { id: 'economy', label: 'Economic Impact', color: 'bg-emerald-500' },
  { id: 'society', label: 'Social Impact', color: 'bg-indigo-500' },
  { id: 'technology', label: 'Technological Impact', color: 'bg-rose-500' }
];

export const historicalEvents: HistoricalEvent[] = [
  { 
    id: 1,
    year: 1800, 
    event: "Industrial Revolution Peak",
    description: "Steam power and mechanized manufacturing transform society",
    impact: { economy: 30, technology: 40, society: -20 },
    effects: [2, 4],
    category: "technological"
  },
  { 
    id: 2,
    year: 1807, 
    event: "Abolition of Slave Trade",
    description: "British Parliament passes the Slave Trade Act",
    impact: { society: 50, economy: -10 },
    effects: [5],
    causedBy: [1],
    category: "social"
  },
  { 
    id: 3,
    year: 1815, 
    event: "Battle of Waterloo",
    description: "Napoleon's final defeat reshapes European politics",
    impact: { society: 20, economy: -15 },
    effects: [],
    category: "political"
  },
  { 
    id: 4,
    year: 1825, 
    event: "First Public Railway",
    description: "Stockton and Darlington Railway begins operation",
    impact: { technology: 35, economy: 25 },
    effects: [],
    causedBy: [1],
    category: "technological"
  },
  {
    id: 5,
    year: 1833,
    event: "Slavery Abolition Act",
    description: "Complete abolition of slavery throughout the British Empire",
    impact: { society: 40, economy: -5 },
    effects: [],
    causedBy: [2],
    category: "social"
  }
];
