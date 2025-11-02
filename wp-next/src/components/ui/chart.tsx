import React, { JSXElementConstructor, ReactElement } from 'react';

import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartContainerProps {
  data: any[];
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  data,
  children,
  margin,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {React.cloneElement(children, { data, margin })}
    </ResponsiveContainer>
  );
};

interface ChartTooltipContentProps {
  className?: string;
  valueSuffix?: string;
  active?: boolean;
  payload?: any;
  label?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  className,
  valueSuffix,
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={`p-2 ${className}`}>
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p
          key={`item-${index}`}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {`${entry.name}: ${entry.value}${valueSuffix || ''}`}
        </p>
      ))}
    </div>
  );
};

// Export ChartTooltip as a renamed export of RechartsTooltip
export const ChartTooltip = RechartsTooltip;

export {
  RechartsBarChart as BarChart,
  RechartsLineChart as LineChart,
  RechartsPieChart as PieChart,
};
