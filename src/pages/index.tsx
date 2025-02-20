// src/pages/index.tsx
import AdvancedTimeline from '@/components/timeline/AdvancedTimeline';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AdvancedTimeline 
        showConnections={true}
        enableZoom={true}
        allowFiltering={true}
        interactive={true}
      />
    </main>
  );
}
