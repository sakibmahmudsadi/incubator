import axios from "axios";
import type { SensorData } from "../types/sensor";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 5000,
});

export async function fetchSensorData(signal?: AbortSignal) {
  const startedAt = performance.now();
  const response = await api.get<SensorData>("/api/data", { signal });
  const latency = performance.now() - startedAt;

  return {
    data: response.data,
    latency,
  };
}
