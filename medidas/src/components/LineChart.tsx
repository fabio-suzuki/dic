import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { formatMetric } from '../lib/calculations';

export interface ChartPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  data: ChartPoint[];
  unit: string;
  width: number;
  height?: number;
}

const PADDING = { top: 16, right: 16, bottom: 24, left: 40 };

export function LineChart({ data, unit, width, height = 200 }: LineChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>Sem dados para esta medida ainda.</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || Math.max(1, rawMax * 0.1);
  const min = rawMin - span * 0.15;
  const max = rawMax + span * 0.15;

  const innerWidth = Math.max(1, width - PADDING.left - PADDING.right);
  const innerHeight = Math.max(1, height - PADDING.top - PADDING.bottom);

  const x = (index: number) =>
    PADDING.left + (data.length === 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth);
  const y = (value: number) => PADDING.top + (1 - (value - min) / (max - min)) * innerHeight;

  const linePath = data
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.value)}`)
    .join(' ');
  const areaPath =
    data.length > 1
      ? `${linePath} L ${x(data.length - 1)} ${PADDING.top + innerHeight} L ${x(0)} ${
          PADDING.top + innerHeight
        } Z`
      : '';

  const gridValues = [max, (max + min) / 2, min];

  return (
    <View>
      <Svg width={width} height={height}>
        {gridValues.map((value) => (
          <React.Fragment key={value}>
            <Line
              x1={PADDING.left}
              y1={y(value)}
              x2={width - PADDING.right}
              y2={y(value)}
              stroke={COLORS.border}
              strokeWidth={1}
            />
            <SvgText
              x={PADDING.left - 6}
              y={y(value) + 4}
              fontSize={10}
              fill={COLORS.textSecondary}
              textAnchor="end"
            >
              {formatMetric(value)}
            </SvgText>
          </React.Fragment>
        ))}

        {areaPath ? <Path d={areaPath} fill={COLORS.chartFill} /> : null}
        <Path d={linePath} stroke={COLORS.chartLine} strokeWidth={2.5} fill="none" />

        {data.map((point, index) => (
          <Circle
            key={`${point.date}-${index}`}
            cx={x(index)}
            cy={y(point.value)}
            r={4}
            fill={COLORS.surface}
            stroke={COLORS.chartLine}
            strokeWidth={2}
          />
        ))}

        <SvgText
          x={PADDING.left}
          y={height - 6}
          fontSize={10}
          fill={COLORS.textSecondary}
          textAnchor="start"
        >
          {shortDate(data[0].date)}
        </SvgText>
        {data.length > 1 ? (
          <SvgText
            x={width - PADDING.right}
            y={height - 6}
            fontSize={10}
            fill={COLORS.textSecondary}
            textAnchor="end"
          >
            {shortDate(data[data.length - 1].date)}
          </SvgText>
        ) : null}
      </Svg>
      <Text style={styles.caption}>
        {data.length} registro{data.length > 1 ? 's' : ''} · valores em {unit}
      </Text>
    </View>
  );
}

function shortDate(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  caption: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
