export interface SensorData {
  airTemp: number;
  humidity: number;
  bodyTemp: number;
  heartRate: number;
  spo2: number;
  uptime: number;
}

export interface SensorReading extends SensorData {
  timestamp: number;
  label: string;
  sequence: number;
}

export type ConnectionState = "connecting" | "connected" | "disconnected";
