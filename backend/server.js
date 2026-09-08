require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());

const ESP32_URL =
  process.env.ESP32_SENSOR_URL || "http://localhost:82/sensor";
const ESP32_VIDEO_URL =
  process.env.ESP32_VIDEO_URL || "http://localhost:81/stream";

let latest = {};
let mjpegClients = [];
let esp32ContentType = 'multipart/x-mixed-replace; boundary=123456789000000000000987654321';
let streamConnected = false;

function startVideoProxy() {
    http.get(ESP32_VIDEO_URL, (response) => {
        streamConnected = true;
        console.log("Connected to ESP32 Video Stream");
        if (response.headers['content-type']) {
            esp32ContentType = response.headers['content-type'];
        }
        response.on('data', (chunk) => {
            mjpegClients.forEach(client => {
                try { client.write(chunk); } catch (e) {}
            });
        });
        response.on('end', () => {
            streamConnected = false;
            console.log("ESP32 stream ended, reconnecting...");
            mjpegClients.forEach(client => { try { client.end(); } catch (e) {} });
            mjpegClients = [];
            setTimeout(startVideoProxy, 500);
        });
    }).on('error', (err) => {
        streamConnected = false;
        console.log("ESP32 Video Offline... retrying in 1s");
        mjpegClients.forEach(client => { try { client.end(); } catch (e) {} });
        mjpegClients = [];
        setTimeout(startVideoProxy, 1000);
    });
}
startVideoProxy();

async function fetchESP32() {

    try {

        const response = await axios.get(ESP32_URL, {
            timeout: 1000
        });

        latest = response.data;

        io.emit("sensorData", latest);

    }
    catch (err) {
        console.log("ESP32 Offline");
        io.emit("esp32Offline");
    }

}

setInterval(fetchESP32, 1000);

app.get("/api/data", (req, res) => {

    res.json(latest);

});

app.get("/api/stream-status", (req, res) => {
    res.json({ connected: streamConnected });
});

app.get("/api/stream", (req, res) => {
    res.writeHead(200, {
        'Content-Type': esp32ContentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'close',
        'Pragma': 'no-cache'
    });
    
    mjpegClients.push(res);
    
    req.on('close', () => {
        mjpegClients = mjpegClients.filter(c => c !== res);
    });
});

io.on("connection", () => {

    console.log("Dashboard Connected");

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log("================================");
    console.log("Backend Started");
    console.log("API:");
    console.log(`http://localhost:${PORT}/api/data`);
    console.log("================================");

});