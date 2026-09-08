import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSensorData } from "../services/api";
import { socket } from "../services/socket";
import type { ConnectionState, SensorData, SensorReading } from "../types/sensor";
import { formatChartTime, toFiniteNumber } from "../utils/format";

function normalizeSensorData(sensor: SensorData): SensorData {
  return {
    airTemp: toFiniteNumber(sensor.airTemp),
    humidity: toFiniteNumber(sensor.humidity),
    bodyTemp: toFiniteNumber(sensor.bodyTemp),
    heartRate: toFiniteNumber(sensor.heartRate),
    spo2: toFiniteNumber(sensor.spo2),
    uptime: toFiniteNumber(sensor.uptime),
  };
}

export function useSensorMonitor() {
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sequenceRef = useRef(0);

  const applySensorData = useCallback((sensor: SensorData) => {
    setConnectionState("connected");
    const normalized = normalizeSensorData(sensor);
    const receivedAt = new Date();
    sequenceRef.current += 1;

    const reading: SensorReading = {
      ...normalized,
      timestamp: receivedAt.getTime(),
      label: formatChartTime(receivedAt),
      sequence: sequenceRef.current,
    };

    setData(normalized);
    setLastUpdate(receivedAt);
    setHistory((current) => [...current, reading].slice(-60));
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchSensorData(controller.signal)
      .then(({ data: sensor, latency }) => {
        setApiLatency(latency);
        applySensorData(sensor);
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load sensor data");
      });

    return () => {
      controller.abort();
    };
  }, [applySensorData]);

  useEffect(() => {
    function handleConnect() {
      setConnectionState("connected");
    }

    function handleDisconnect() {
      setConnectionState("disconnected");
    }

    function handleConnectError() {
      setConnectionState("disconnected");
    }

    function handleEsp32Offline() {
      setConnectionState("disconnected");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("sensorData", applySensorData);
    socket.on("esp32Offline", handleEsp32Offline);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("sensorData", applySensorData);
      socket.off("esp32Offline", handleEsp32Offline);
    };
  }, [applySensorData]);

  return {
    data,
    history,
    connected: connectionState === "connected",
    connectionState,
    lastUpdate,
    apiLatency,
    loading,
    error,
  };
}
