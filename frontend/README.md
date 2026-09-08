# SIIMS Frontend

React + TypeScript + Vite dashboard for the Smart Infant Incubator Monitoring System (SIIMS).

## What It Does

Displays real-time sensor data (air temperature, humidity, body temperature, heart rate, SpO2) and live video from the ESP32-CAM, with automatic status indication and trend charts.

## Technology Stack

- React 19 + TypeScript
- Vite (build tool)
- TailwindCSS 4
- Socket.io-client (WebSocket)
- Recharts (trend charts)
- Lucide React (icons)
- Framer Motion (animations)

## Setup

```bash
npm install
```

## Configuration

Create a `.env` file (or copy from `.env.example`):

```
VITE_API_URL=http://localhost:3000
```

This should point to the SIIMS backend server.

## Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

## Build

```bash
npm run build
```

Output is in the `dist/` directory.

## Lint

```bash
npm run lint
```
