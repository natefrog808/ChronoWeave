// Save as: src/app/page.tsx

import ChronoWeaveLogo from '@/components/ChronoWeaveLogo';
import { AdvancedTimeline } from '@/components/timeline/AdvancedTimeline';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="w-64 h-32 mx-auto mb-8">
        <ChronoWeaveLogo />
      </div>
      <AdvancedTimeline />
    </main>
  );
}
