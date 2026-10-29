import React from 'react';
import { calculateWorldwideScorePercentile } from '../utils/coffeeStats';

interface WorldwideBellCurveProps {
  userScore: number;
  label?: string;
}

export const WorldwideBellCurve: React.FC<WorldwideBellCurveProps> = ({
  userScore,
  label = 'Your Coffee Score',
}) => {
  const percentile = calculateWorldwideScorePercentile(userScore);

  // Normal distribution parameters for world coffee specialty ratings
  // Mean = 7.8, Standard Deviation = 0.95
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 24;

  const minScore = 5.0;
  const maxScore = 10.0;

  const normalPdf = (x: number, mean = 7.84, sd = 0.92) => {
    const factor = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(sd, 2));
    return factor * Math.exp(exponent);
  };

  const getX = (score: number) => {
    return paddingX + ((score - minScore) / (maxScore - minScore)) * (width - paddingX * 2);
  };

  const getY = (val: number, maxPdf = 0.44) => {
    return height - paddingY - (val / maxPdf) * (height - paddingY * 2);
  };

  // Generate curve points
  const points: { x: number; y: number }[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const s = minScore + (i / steps) * (maxScore - minScore);
    const pdf = normalPdf(s);
    points.push({ x: getX(s), y: getY(pdf) });
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - paddingY} L ${points[0].x.toFixed(1)} ${height - paddingY} Z`;

  const userX = getX(Math.max(minScore, Math.min(maxScore, userScore)));
  const userPdf = normalPdf(Math.max(minScore, Math.min(maxScore, userScore)));
  const userY = getY(userPdf);

  const topPercent = Math.max(1, 100 - percentile);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-xl">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Baseline */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="currentColor"
            className="text-stone-300 dark:text-stone-700"
            strokeWidth="1"
          />

          {/* Shaded Area */}
          <path d={areaD} fill="url(#bellGrad)" />

          {/* Bell Curve Line */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            className="text-stone-400 dark:text-stone-500"
            strokeWidth="1.75"
          />

          {/* Median line at 7.8 */}
          <line
            x1={getX(7.84)}
            y1={getY(normalPdf(7.84))}
            x2={getX(7.84)}
            y2={height - paddingY}
            stroke="currentColor"
            className="text-stone-300 dark:text-stone-700"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <text
            x={getX(7.84)}
            y={height - 8}
            textAnchor="middle"
            className="text-[10px] font-mono fill-stone-500 dark:fill-stone-400"
          >
            World Avg (7.8)
          </text>

          {/* Score tick marks */}
          {[6.0, 7.0, 8.0, 9.0, 10.0].map((s) => (
            <text
              key={s}
              x={getX(s)}
              y={height - 8}
              textAnchor="middle"
              className="text-[9px] font-mono fill-stone-400 dark:fill-stone-600"
            >
              {s.toFixed(1)}
            </text>
          ))}

          {/* User Score Pin */}
          <line
            x1={userX}
            y1={userY}
            x2={userX}
            y2={height - paddingY}
            className="stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="2"
          />
          <circle
            cx={userX}
            cy={userY}
            r="5"
            className="fill-amber-600 dark:fill-amber-400 stroke-white dark:stroke-stone-900"
            strokeWidth="2"
          />

          {/* User Callout Flag */}
          <g transform={`translate(${Math.min(userX, width - 110)}, ${Math.max(12, userY - 32)})`}>
            <rect
              x="-48"
              y="-12"
              width="96"
              height="20"
              rx="4"
              className="fill-stone-900 dark:fill-stone-100"
            />
            <text
              x="0"
              y="2"
              textAnchor="middle"
              className="text-[10px] font-semibold fill-white dark:fill-stone-900 font-mono tabular-nums"
            >
              {userScore.toFixed(1)} · Top {topPercent}%
            </text>
          </g>
        </svg>

        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mt-2 px-2">
          <span>{label}: <strong className="text-amber-700 dark:text-amber-400 font-mono tabular-nums">{userScore.toFixed(1)}/10</strong></span>
          <span>Rank: <strong className="text-stone-900 dark:text-stone-100 font-mono">{percentile}th Percentile</strong></span>
        </div>
      </div>
    </div>
  );
};
