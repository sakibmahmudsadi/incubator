# SIIMS: Smart Infant Incubator Monitoring System

<div align="center">
  <img src="frontend/public/favicon.svg" alt="SIIMS Logo" width="80" height="80">
</div>

A low-cost smart infant incubator monitoring system for real-time tracking of environmental and physiological parameters in neonatal care. Developed as part of a research project in embedded systems and IoT-based medical monitoring.

## Overview

SIIMS provides continuous monitoring of:

- **Air temperature** and **humidity** (DHT22 sensor)
- **Body temperature** (DS18B20 probe)
- **Heart rate** and **SpO2** (MAX30100 pulse oximeter)
- **Live video monitoring** (ESP32-CAM MJPEG stream)
- **Automated hardware alarms** (LED + buzzer via BJT transistor circuit)
- **Web-based real-time dashboard** (React/TypeScript frontend)

The system uses a three-tier architecture: ESP32-CAM firmware for sensor acquisition and video streaming, a Node.js/Express backend for data proxying and WebSocket distribution, and a React/TypeScript/Vite frontend for real-time visualization.

## Features

- Dual-core ESP32 firmware: Core 1 handles sensor polling and fail-safe logic; Core 0 manages WiFi, HTTP, and video streaming
- Real-time JSON sensor data via HTTP (port 82) and WebSocket push to clients
- MJPEG video proxy allowing multiple simultaneous viewers without overloading the ESP32
- Automated hardware fail-safe: BJT transistor circuit triggers red LED and active buzzer when body temperature falls outside the safe range (30.0-35.0 degrees C)
- Normal status LED (GPIO 3) indicates body temperature within the configured 30–35°C range; warning LED and buzzer (GPIO 2) activate when body temperature is outside this range
- React dashboard with dark/light theme, live vital cards, trend charts, and connection status
- Demo login for dashboard access

## System Architecture

```
ESP32-CAM (Sensors + Camera)
    |
    |--- Port 82 /sensor  (JSON: airTemp, humidity, bodyTemp, heartRate, spo2)
    |--- Port 81 /stream  (MJPEG video)
    |
Node.js/Express Backend (port 3000)
    |--- Polls ESP32 sensor data every 1 second
    |--- Proxies MJPEG video stream
    |--- Broadcasts via WebSocket to connected clients
    |--- REST API: /api/data, /api/stream, /api/stream-status
    |
React/TypeScript/Vite Frontend
    |--- Polls /api/data for live sensor values
    |--- Renders MJPEG stream from /api/stream
    |--- Real-time WebSocket updates
    |--- Dark/light theme toggle
```

See [`assets/ArchitectureDiagram.md`](assets/ArchitectureDiagram.md) for the detailed Mermaid architecture diagram.

## Hardware

| Component | Model | Purpose |
|---|---|---|
| Microcontroller | AI Thinker ESP32-CAM | Main controller with WiFi and camera |
| Air Temperature + Humidity | DHT22 | Environmental monitoring |
| Body Temperature | DS18B20 (OneWire) | Neonatal skin temperature probe |
| Heart Rate + SpO2 | MAX30100 (I2C) | Pulse oximetry |
| Normal Status LED | LED on GPIO 3 | ON when body temperature is within 30–35°C |
| Warning LED | Red LED on GPIO 2 | Activates with buzzer when body temperature is outside 30–35°C |
| Transistor | 2N3904 (NPN) | Switches high-current buzzer circuit |
| Active Buzzer | Buzzer via transistor | Audio alarm for critical conditions |

## Pin Configuration

### ESP32-CAM GPIO Assignments

| GPIO | Function | Direction | Notes |
|---|---|---|---|
| 2 | Warning LED / BJT Base | Output | Triggers red LED + buzzer when body temp outside 30-35 degrees C |
| 3 | Normal Status LED (U0R) | Output | ON when body temperature is within 30–35°C |
| 12 | MAX30100 I2C SCL | Output | I2C clock for pulse oximeter |
| 13 | DHT22 Data | Bidirectional | Air temperature + humidity sensor |
| 14 | DS18B20 OneWire | Bidirectional | Body temperature probe |
| 15 | MAX30100 I2C SDA | Bidirectional | I2C data for pulse oximeter |

Camera pins (GPIO 0, 5, 18, 19, 21, 22, 23, 25, 26, 27, 32, 34, 35, 36, 39) are configured in `firmware/Globals.h` for the AI Thinker ESP32-CAM module and should not be modified.

### Server Port Allocation

| Port | Service | Protocol |
|---|---|---|
| 80 | Camera HTTP control panel | HTTP |
| 81 | Camera MJPEG stream | HTTP |
| 82 | Sensor data JSON API | HTTP |
| 3000 | Node.js backend (configurable) | HTTP + WebSocket |

## Software Requirements

- [Arduino IDE](https://www.arduino.cc/en/software) with ESP32 board support
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Modern web browser (Chrome, Firefox, Edge)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sakibmahmudsadi/incubator.git
cd incubator
```

### 2. Configure ESP32 Firmware

1. Open `firmware/InfantIncubator/InfantIncubator.ino` in the Arduino IDE.
2. In `firmware/Globals.h`, replace the WiFi placeholder values:

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

3. Install required Arduino libraries:
   - DHT sensor library (Adafruit)
   - DallasTemperature
   - OneWire
   - ArduinoJson
   - MAX30100_PulseOximeter (by OXullo)
4. Select board: **AI Thinker ESP32-CAM**
5. Flash the firmware. **Important:** Disconnect GPIO 0 from GND before flashing; reconnect after reset.

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your ESP32 IP address:

```
ESP32_SENSOR_URL=http://YOUR_ESP32_IP:82/sensor
ESP32_VIDEO_URL=http://YOUR_ESP32_IP:81/stream
PORT=3000
```

Start the backend:

```bash
npm start
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` if needed (default points to localhost:3000):

```
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

## Backend Configuration

The backend requires the following environment variables (set in `backend/.env`):

| Variable | Default | Description |
|---|---|---|
| `ESP32_SENSOR_URL` | `http://localhost:82/sensor` | ESP32 sensor JSON endpoint |
| `ESP32_VIDEO_URL` | `http://localhost:81/stream` | ESP32 MJPEG stream endpoint |
| `PORT` | `3000` | Backend server listening port |

The frontend uses:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Backend server URL |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/data` | Returns latest sensor data as JSON |
| GET | `/api/stream` | MJPEG video stream (multipart) |
| GET | `/api/stream-status` | Returns `{ connected: boolean }` indicating ESP32 stream status |

### Sensor Data Response

```json
{
  "airTemp": 28.5,
  "humidity": 65.2,
  "bodyTemp": 33.1,
  "heartRate": 72,
  "spo2": 98,
  "uptime": 123456
}
```

## Reproducibility

To reproduce the software setup:

1. Clone the repository and follow the installation steps above.
2. Flash the ESP32-CAM firmware with your WiFi credentials.
3. Configure the backend `.env` with the ESP32's IP address (printed to Serial Monitor on boot).
4. Start the backend and frontend.
5. The dashboard should display live sensor data within a few seconds of ESP32 boot.

The ESP32 IP address can be found by checking your router's DHCP client list or reading the Serial Monitor output at 115200 baud after the ESP32 connects to WiFi.

## Citation

If you use SIIMS in your research, please cite this repository. A `CITATION.cff` file is included in the repository root for automated citation generation by GitHub and other tools.

A versioned release will be archived on Zenodo for long-term preservation and DOI assignment. The DOI will be added to the `CITATION.cff` after Zenodo processing.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Exception:** `firmware/InfantIncubator/app_httpd.cpp` is derived from Espressif Systems' ESP32 camera driver and is licensed under the Apache License 2.0.

## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="assets/homedark.png" alt="Dashboard Dark Mode" width="400"/><br><b>Dashboard (Dark Mode)</b></td>
      <td align="center"><img src="assets/homelight.png" alt="Dashboard Light Mode" width="400"/><br><b>Dashboard (Light Mode)</b></td>
    </tr>
    <tr>
      <td align="center"><img src="assets/readingdark.png" alt="Active Readings Dark" width="400"/><br><b>Live Biometrics (Dark)</b></td>
      <td align="center"><img src="assets/reading1.png" alt="Active Readings Light 1" width="400"/><br><b>Live Biometrics (Light)</b></td>
    </tr>
    <tr>
      <td align="center"><img src="assets/reading2.png" alt="Active Readings Light 2" width="400"/><br><b>System Warnings</b></td>
      <td align="center"><img src="assets/login.png" alt="Login" width="400"/><br><b>Demo Login</b></td>
    </tr>
  </table>
</div>
