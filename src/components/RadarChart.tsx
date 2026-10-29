import React from 'react';

interface RadarChartProps {
  userScores: {
    taste: number;
    barista: number;
    shopLook: number;
    overall: number;
  };
  worldScores: {
    taste: number;
    barista: number;
    shopLook: number;
    overall: number;
  };
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  userScores,
  worldScores,
  size = 300,
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  const axes = [
    { label: 'Taste & Extraction', userVal: userScores.taste, worldVal: worldScores.taste },
    { label: 'Barista Craft', userVal: userScores.barista, worldVal: worldScores.barista },
    { label: 'Shop Atmosphere', userVal: userScores.shopLook, worldVal: worldScores.shopLook },
    { label: 'Overall Experience', userVal: userScores.overall, worldVal: worldScores.overall },
  ];

  const totalAxes = axes.length;

  const getCoordinates = (value: number, index: number, max = 10) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(value, max)) / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = radius + 28;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const levels = [2.5, 5, 7.5, 10];

  const userPoints = axes.map((a, i) => getCoordinates(a.userVal, i)).map((p) => `${p.x},${p.y}`).join(' ');
  const worldPoints = axes.map((a, i) => getCoordinates(a.worldVal, i)).map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {levels.map((lvl) => {
          const points = axes
            .map((_, i) => getCoordinates(lvl, i))
            .map((p) => `${p.x},${p.y}`)
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={points}
              fill="none"
              stroke="currentColor"
              className="text-stone-200 dark:text-stone-800"
              strokeWidth="1"
              strokeDasharray={lvl === 10 ? 'none' : '3 3'}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((_, i) => {
          const p = getCoordinates(10, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              className="text-stone-200 dark:text-stone-800"
              strokeWidth="1"
            />
          );
        })}

        {/* World Specialty Polygon */}
        <polygon
          points={worldPoints}
          className="fill-stone-400/20 stroke-stone-500 dark:fill-stone-500/20 dark:stroke-stone-400"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* User Polygon */}
        <polygon
          points={userPoints}
          className="fill-amber-600/30 stroke-amber-600 dark:fill-amber-500/30 dark:stroke-amber-400"
          strokeWidth="2.5"
        />

        {/* User Points */}
        {axes.map((a, i) => {
          const p = getCoordinates(a.userVal, i);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-amber-700 dark:fill-amber-400 stroke-white dark:stroke-stone-900"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((a, i) => {
          const lp = getLabelCoordinates(i);
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (lp.x < center - 15) textAnchor = 'end';
          else if (lp.x > center + 15) textAnchor = 'start';

          return (
            <text
              key={i}
              x={lp.x}
              y={lp.y + 4}
              textAnchor={textAnchor}
              className="text-[11px] font-medium fill-stone-600 dark:fill-stone-400"
            >
              {a.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs font-medium text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1.5 bg-amber-600 rounded-sm"></span>
          <span>Your Coffee Average</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1.5 border-b-2 border-stone-400 border-dashed"></span>
          <span>World Specialty Avg (7.8)</span>
        </div>
      </div>
    </div>
  );
};
