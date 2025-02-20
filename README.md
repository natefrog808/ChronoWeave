# 🌟 ChronoWeave: Time Travel Simulation Platform

*Because who needs a DeLorean when you’ve got TypeScript, Tailwind, and a touch of temporal magic?*

## 🚀 Overview

Welcome to **ChronoWeave**, where the butterfly effect isn’t just a theory—it’s a full-on "hold my quantum beer" experience. Witness the Industrial Revolution ripple through time, watch Faraday’s electromagnetic discovery spark revolutions, and see how a single steam engine can rewrite history. This isn’t just a timeline—it’s a living, breathing simulation of cause, effect, and everything in between.

## ✨ Features That Make Time Lords Jealous

### 🎯 Core Features
- **Interactive Timeline Visualization**: Zoom, pan, and hover through history—no PhD in quantum physics required.
- **Real-Time Cause-and-Effect Simulation**: See impacts propagate with exponential decay across decades.
- **Branching History Paths**: Fork timelines and explore alternate realities (paradox-free™ guaranteed).
- **Dynamic Impact Calculations**: Economy, society, technology, and more—tracked with precision that would make Einstein nod approvingly.
- **Theme System**: Light, dark, past, future, or paradox—style your journey through time.

### 🔮 Smart Historical Analysis
- **Advanced Event Relationship Mapping**: Direct effects, dependencies, and even indirect tag-based connections.
- **Impact Propagation**: Watch effects ripple with realistic decay and strength weighting.
- **Real-Time Metrics**: Live updates on societal, economic, and technological health.
- **Paradox Detection & Resolution**: Catch circular dependencies before they unravel the fabric of time.

### 🎨 UI Components That Time Forgot
- **Fully Accessible**: Screen-reader friendly, keyboard-navigable—time travel for all dimensions.
- **Temporal Themes**: Smooth transitions between past parchment and futuristic neon.
- **Responsive Design**: Adapts to any screen, from pocket watches to holodecks.
- **Animated Interactions**: Glows, ripples, and slides that make history feel alive.

### 🧠 Developer Goodies
- **Debug Panel**: Peek under the hood with simulation stats and anomaly reports.
- **Feature Flags**: Toggle zoom, animations, and more via `.env`.
- **Type-Safe**: TypeScript ensures your timeline stays intact across centuries.

## 🛠 Tech Stack (Time-Tested™)

- **Next.js**: Server-side rendering for instant timeline jumps.
- **TypeScript**: Type-checking that spans millennia.
- **Tailwind CSS**: Quantum styling with a temporal twist.
- **shadcn/ui**: Pre-built components with ChronoWeave flair.
- **Framer Motion**: Animations smoother than a temporal vortex.
- **Zustand**: Lightweight state management for branching timelines.
- **CVA**: Component variants that evolve faster than Darwin’s finches.
- **Lucide React**: Icons that transcend time.

## 🚀 Installation

```bash
# Clone the repository (temporal coordinates included)
git clone https://github.com/yourusername/chronoweave.git

# Travel to the project directory
cd chronoweave

# Install dependencies (time-travel safe)
npm install

# Launch the temporal viewer
npm run dev
```

## 📁 Project Structure (Time-Organized™)

```
chronoweave/
├── src/
│   ├── components/
│   │   ├── timeline/
│   │   │   ├── AdvancedTimeline.tsx  # The heart of ChronoWeave
│   │   │   ├── EffectsPanel.tsx     # Dynamic impact dashboard
│   │   │   ├── TimelineConnections.tsx  # Curved SVG connections
│   │   │   └── TimelineLegend.tsx   # Interactive filtering legend
│   │   └── ui/
│   │       ├── card.tsx             # Temporal-enhanced cards
│   │       ├── button.tsx           # Sleek action triggers
│   │       └── select.tsx           # Dropdowns for time control
│   ├── data/
│   │   └── timelineData.ts          # Rich historical dataset
│   ├── hooks/
│   │   └── useTheme.ts              # Theme system with temporal flair
│   ├── lib/
│   │   └── utils.ts                 # General-purpose utilities
│   ├── utils/
│   │   └── timelineUtils.ts         # Temporal simulation toolkit
│   ├── types/
│   │   ├── components.ts            # UI component types
│   │   └── timeline.ts              # Timeline-specific types
│   ├── pages/
│   │   ├── index.tsx                # Entry point
│   │   └── api/                     # Future API routes
│   └── styles/
│       └── globals.css              # CSS variables & transitions
├── .env                             # Configurable settings
├── tailwind.config.js               # Temporal Tailwind magic
└── package.json                     # Dependencies & scripts
```

## 🎮 Usage

```typescript
// Import from any temporal dimension
import { AdvancedTimeline } from '@/components/timeline/AdvancedTimeline';

// Deploy your temporal viewer
export default function TimeTravel() {
  return (
    <div className="temporal-container min-h-screen bg-background text-foreground">
      <AdvancedTimeline
        showConnections={true}
        enableZoom={true}
        allowFiltering={true}
        interactive={true}
      />
    </div>
  );
}
```

## 🎨 UI Components

Our enhanced components come with:
- **Temporal Cards**: Glow, ripple, and hover effects for a sci-fi feel.
- **Animated Connections**: Curved SVG paths with pulsing dashes.
- **Impact Dashboard**: Real-time bars with trend graphs and tooltips.
- **Legend Controls**: Toggle categories and impacts with live stats.

```typescript
import { Card } from '@/components/ui/card';

// Example of an enhanced card
<Card
  variant="temporal"
  glow="subtle"
  isHoverable
  isInteractive
  ripple
>
  Time-traveling content goes here
</Card>
```

## 🧪 Features in Detail

### Enhanced Theme Management
```typescript
const { theme, updateTheme } = useTheme();
// Options: 'light', 'dark', 'system', 'past', 'future', 'paradox'
// Persists across sessions and animates transitions
```

### Smart Simulation Engine
- **Decay-Based Propagation**: Effects fade realistically over time.
- **Branching**: Fork timelines with a single click.
- **Zoom**: Scale the timeline from 0.5x to 2x for detail or overview.

### Accessibility Features
- ARIA attributes for every interaction.
- Keyboard navigation for timeline jumps and filtering.
- Screen reader announcements for theme switches and anomalies.
- High-contrast temporal themes.

### Performance Optimizations
- Memoized calculations for events and effects.
- Optimized SVG rendering for connections.
- Lightweight Zustand state for branches.
- Tailwind’s JIT compilation for a tiny bundle.

## 🛠 Setup & Configuration

### Prerequisites
- Node.js 16+ & npm 7+

### Environment Variables (`.env`)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ZOOM=true
NEXT_PUBLIC_SHOW_DEBUG_PANEL=false
NEXT_PUBLIC_TIMELINE_BASE_YEAR=1800
NEXT_PUBLIC_TIMELINE_YEAR_RANGE=50
NEXT_PUBLIC_DEFAULT_DECAY_FACTOR=20
```

## 🤝 Contributing

1. Fork the timeline.
2. Create your feature branch (`git checkout -b feature/temporal-warp`).
3. Commit your changes (`git commit -m "Add temporal warp effect"`).
4. Push to the branch (`git push origin feature/temporal-warp`).
5. Open a Pull Request.
6. Don’t accidentally erase your own existence (we’ve got paradox detection for that).

## 📜 License

MIT License—use it in any timeline, just don’t break the space-time continuum.

## 🙏 Acknowledgments

- **Industrial Revolution**: For kicking off this wild ride.
- **Michael Faraday**: For electrifying our timelines.
- **Coffee**: The true fuel of time travel.
- **You**: For exploring ChronoWeave’s infinite possibilities.

## 🐛 Known Issues

- Can’t physically travel through time (yet—PRs welcome!).
- May induce an insatiable curiosity about historical what-ifs.
- Side effects: Temporal vertigo, a newfound love for steam engines, and a sudden urge to ban Comic Sans.

## 🌌 Roadmap

- Event editor for custom timelines.
- Real-time collaboration across branches.
- AI-driven historical predictions.
- Actual time travel (pending quantum breakthrough).

---

*For support, open an issue or send a message via temporal beacon (quantum entanglement preferred).*

*Remember: The best way to predict the future is to simulate it. The second best way is to create it. With ChronoWeave, we’re doing both—across every timeline imaginable.*


