// src/pages/index.tsx
import AdvancedTimeline from '@/components/timeline/AdvancedTimeline';
import { historicalEvents } from '@/data/timelineData';

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">ChronoWeave</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Explore historical events and their interconnected impacts through time.
        </p>
        
        <AdvancedTimeline 
          showConnections={true}
          enableZoom={true}
          allowFiltering={true}
          interactive={true}
          events={historicalEvents}
          initialYear={1800}
          yearRange={50}
          pixelsPerYear={4}
        />
      </div>
    </div>
  );
}
