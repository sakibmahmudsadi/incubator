export type StatusLevel = "normal" | "warning";

export interface MetricStatus {
  id: string;
  label: string;
  value: number;
  unit: string;
  level: StatusLevel;
  message: string;
}
