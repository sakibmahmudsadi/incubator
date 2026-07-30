<div align="center">
  <img src="frontend/public/favicon.svg" alt="Logo" width="80" height="80">

  <h3 align="center">Infant Incubator</h3>

  <p align="center">
    A complete dual-core IoT and medical monitoring ecosystem featuring real-time biometric tracking, automated fail-safe alarms, and a live MJPEG video proxy.
    <br />
    <br />
    <b>Live Demo:</b> <a href="https://incubator.betprojects.me">incubator.betprojects.me</a><br>
    <i>Username: SADI | Password: SAMIN</i>
  </p>
</div>

## About The Project

<div align="center">
  <img src="assets/homedark.png" alt="Dashboard Screenshot" width="800">
</div>
<br>

This project is a fully integrated IoT Infant Incubator monitoring system. It uses an ESP32-CAM to read vital medical sensors (DHT22, DS18B20, MAX30100) and stream video. To prevent the ESP32 from crashing under heavy load, a custom Node.js multiplexer server acts as a proxy, fetching data from the ESP32 once per second and streaming it to a modern React dashboard via WebSockets.

The hardware features built-in dual-core logic: Core 1 handles the critical sensor polling and fail-safe breadboard circuits (triggering an active buzzer and red LED if body temperature drops), while Core 0 manages the HTTP and video streams. 

## Built With

<table>
  <tr>
    <td align="left">
      <b>Software & Frameworks</b><br><br>
      <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"><br>
      <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"><br>
      <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"><br>
      <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"><br>
      <img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white"><br>
      <img src="https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white">
    </td>
    <td align="left">
      <b>Hardware & Components</b><br><br>
      <img src="https://img.shields.io/badge/ESP32--CAM-000000?style=for-the-badge&logo=espressif&logoColor=red"><br>
      <img src="https://img.shields.io/badge/DHT22_Sensor-4A90E2?style=for-the-badge"><br>
      <img src="https://img.shields.io/badge/DS18B20_Probe-FF4B4B?style=for-the-badge"><br>
      <img src="https://img.shields.io/badge/MAX30100_Oximeter-F5A623?style=for-the-badge"><br>
      <img src="https://img.shields.io/badge/2N2222_Transistor-8B572A?style=for-the-badge"><br>
      <img src="https://img.shields.io/badge/Active_Buzzer_&_LEDs-F8E71C?style=for-the-badge&logoColor=black">
    </td>
  </tr>
</table>

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
      <td align="center"><img src="assets/login.png" alt="Authentication" width="400"/><br><b>Secure Medical Portal</b></td>
    </tr>
  </table>
</div>

## Features

- **Real-Time Vitals:** Live tracking of Body Temperature, Air Temperature, Humidity, Heart Rate, and SpO2.
- **Hardware Fail-safes:** Custom BJT transistor circuit triggers physical alarms (LED + Buzzer) independently if sensor data spikes or drops below critical thresholds (30°C - 35°C).
- **Video Proxying:** Node.js backend proxies the ESP32 MJPEG camera stream, allowing multiple doctors to view the baby simultaneously without crashing the microcontroller.
- **WebSocket Synchronization:** Instant UI updates and "Server Offline" fail-safe badges if the connection drops.
- **Premium Glassmorphism UI:** Built with TailwindCSS and Lucide-react for a pristine, medical-grade aesthetic.

## Getting Started

### 1. Firmware (ESP32-CAM)
1. Open `firmware/InfantIncubator.ino` in the Arduino IDE.
2. In `Globals.h`, insert your home WiFi credentials.
3. Flash to the ESP32-CAM (remember to unplug GPIO 2 / GPIO 3 during flashing!).

### 2. Backend (Node.js)
1. Navigate to the `/backend` directory.
2. Run `npm install` to install dependencies.
3. Run `node server.js` to start the multiplexer on port 5000.

### 3. Frontend (React)
1. Navigate to the `/frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to launch the dashboard locally, or build for production using Cloudflare Pages.

## Architecture 

The system utilizes an explicit dual-core processing model on the ESP32 to prevent network blocking, heavily backed by a Node.js proxy layer to distribute the WebSocket load.

👉 **[Click here to view the complete System Architecture Diagram](assets/ArchitectureDiagram.md)**