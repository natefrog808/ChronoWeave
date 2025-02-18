const AdvancedTimeline = () => {
  const [currentYear, setCurrentYear] = React.useState(1800);
  const [hoveredEvent, setHoveredEvent] = React.useState(null);
  const [highlightedConnections, setHighlightedConnections] = React.useState([]);
  const [filterCategory, setFilterCategory] = React.useState(null);
  const [filterImpact, setFilterImpact] = React.useState(null);
  const [effects, setEffects] = React.useState({
    economy: 100,
    society: 100,
    technology: 100,
    education: 100,
    health: 100
  });

  const categories = [
    { id: 'technological', label: 'Technological', color: 'bg-blue-500' },
    { id: 'social', label: 'Social', color: 'bg-green-500' },
    { id: 'political', label: 'Political', color: 'bg-purple-500' },
    { id: 'economic', label: 'Economic', color: 'bg-amber-500' }
  ];

  const impactTypes = [
    { id: 'economy', label: 'Economic Impact', color: 'bg-emerald-500' },
    { id: 'society', label: 'Social Impact', color: 'bg-indigo-500' },
    { id: 'technology', label: 'Technological Impact', color: 'bg-rose-500' }
  ];

  const historicalEvents = [
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
    }
  ];

  const getFilteredEvents = () => {
    return historicalEvents.filter(event => {
      const categoryMatch = !filterCategory || event.category === filterCategory;
      const impactMatch = !filterImpact || Object.keys(event.impact).includes(filterImpact);
      return categoryMatch && impactMatch;
    });
  };

  const handleTimelineClick = (year) => {
    setCurrentYear(year);
    const event = historicalEvents.find(e => e.year === year);
    if (event) {
      setEffects(prevEffects => {
        const newEffects = { ...prevEffects };
        Object.entries(event.impact).forEach(([metric, value]) => {
          if (metric in newEffects) {
            newEffects[metric] += value;
          }
        });
        return newEffects;
      });
    }
  };

  const handleEventHover = (event) => {
    setHoveredEvent(event);
    if (event) {
      const connections = [];
      if (event.effects) {
        event.effects.forEach(effectId => {
          const effectEvent = historicalEvents.find(e => e.id === effectId);
          if (effectEvent) {
            connections.push({
              from: event.year,
              to: effectEvent.year,
              type: 'effect'
            });
          }
        });
      }
      setHighlightedConnections(connections);
    } else {
      setHighlightedConnections([]);
    }
  };

  const renderEventMarker = (event) => {
    const category = categories.find(c => c.id === event.category);
    return (
      <div 
        key={event.id}
        className="absolute -top-20"
        style={{ left: `${(event.year - 1800) * 4}px` }}
        onMouseEnter={() => handleEventHover(event)}
        onMouseLeave={() => handleEventHover(null)}
      >
        <div className="relative">
          <div className={`w-2 h-8 ${category?.color || 'bg-gray-500'} mx-auto`} />
          <div 
            className={`absolute bottom-full mb-1 w-48 -left-24 ${
              hoveredEvent?.id === event.id ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200`}
          >
            <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-sm">
              <div className="font-medium">{event.event}</div>
              <div className="text-gray-600 text-xs mt-1">{event.description}</div>
              <div className="mt-2 space-y-1">
                {Object.entries(event.impact).map(([metric, value]) => (
                  <div key={metric} className="flex items-center gap-2">
                    <span className="capitalize text-xs w-20">{metric}:</span>
                    <div className={`text-xs font-medium ${
                      value > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {value > 0 ? '+' : ''}{value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    const timelineRange = Array.from({length: 50}, (_, i) => 1800 + i);
    const filteredEvents = getFilteredEvents();
    
    return (
      <div className="relative w-full bg-gray-100 rounded-lg overflow-x-auto">
        <div className="h-48">
          <div className="absolute top-0 left-0 h-full flex items-center">
            {timelineRange.map(year => (
              <div key={year} className="relative">
                <div
                  className={`mx-1 h-16 w-2 cursor-pointer transition-all
                    ${year === currentYear ? 'bg-blue-500' : 'bg-gray-300'}
                    hover:bg-blue-300`}
                  onClick={() => handleTimelineClick(year)}
                />
                {year % 5 === 0 && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-4 h-4 text-purple-500" />
                    <span className="text-xs mt-1">{year}</span>
                  </div>
                )}
              </div>
            ))}
            {filteredEvents.map(event => renderEventMarker(event))}
          </div>
        </div>
      </div>
    );
  };

  const renderEffects = () => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Timeline Effects</h3>
        <div className="space-y-4">
          {Object.entries(effects).map(([metric, value]) => (
            <div key={metric} className="flex items-center gap-2">
              <span className="capitalize w-24">{metric}</span>
              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    value > 100 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{width: `${Math.min(Math.max(value, 0), 200)}%`}}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                    {value.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="text-2xl font-bold">{currentYear}</div>
        {renderTimeline()}
        {renderEffects()}
      </div>
    </div>
  );
};

export default AdvancedTimeline;
