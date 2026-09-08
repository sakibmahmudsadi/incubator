import type { SensorData } from "../types/sensor";
import type { MetricStatus, StatusLevel } from "../types/status";

type VitalMetric = "heartRate" | "spo2" | "bodyTemp" | "humidity";

interface Range {
  min: number;
  max: number;
}

interface Threshold {
  normal: Range;
  warning: Range;
}

export const statusThresholds: Record<VitalMetric, Threshold> = {
  heartRate: {
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 120 },
  },
  spo2: {
    normal: { min: 95, max: 100 },
    warning: { min: 90, max: 100 },
  },
  bodyTemp: {
    normal: { min: 30, max: 35 },
    warning: { min: 25, max: 40 },
  },
  humidity: {
    normal: { min: 50, max: 100 },
    warning: { min: 40, max: 100 },
  },
};

const metricCopy: Record<VitalMetric, { label: string; unit: string }> = {
  heartRate: { label: "Heart Rate", unit: "BPM" },
  spo2: { label: "SpO₂", unit: "%" },
  bodyTemp: { label: "Body Temperature", unit: "°C" },
  humidity: { label: "Humidity", unit: "%" },
};

function inRange(value: number, range: Range) {
  return value >= range.min && value <= range.max;
}

function levelFor(value: number, threshold: Threshold): StatusLevel {
  if (inRange(value, threshold.normal)) {
    return "normal";
  }

  return "warning";
}

function messageFor(metric: VitalMetric, level: StatusLevel) {
  if (level === "normal") {
    return "Within configured range";
  }

  const normal = statusThresholds[metric].normal;
  const unit = metricCopy[metric].unit;
  return `Target ${normal.min}-${normal.max}${unit}`;
}

export function getMetricStatuses(data: SensorData | null): MetricStatus[] {
  if (!data) {
    return [];
  }

  const metrics: VitalMetric[] = ["heartRate", "spo2", "bodyTemp", "humidity"];

  return metrics.map((metric) => {
    const value = data[metric];
    const level = levelFor(value, statusThresholds[metric]);

    return {
      id: metric,
      label: metricCopy[metric].label,
      value,
      unit: metricCopy[metric].unit,
      level,
      message: messageFor(metric, level),
    };
  });
}

export function getSystemStatus(statuses: MetricStatus[]): StatusLevel {
  if (statuses.some((status) => status.level === "warning")) {
    return "warning";
  }

  return "normal";
}

export function statusLabel(level: StatusLevel) {
  if (level === "warning") {
    return "WARNING";
  }

  return "NORMAL";
}
