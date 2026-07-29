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

// CHANGE THIS IF YOUR ESP32 IP CHANGES
const ESP32_URL = "http://192.168.253.128:82/sensor";
const ESP32_VIDEO_URL = "http://192.168.253.128:81/stream";

let latest = {};
let mjpegClients = [];
let esp32ContentType = 'multipart/x-mixed-replace; boundary=123456789000000000000987654321';

function startVideoProxy() {
    http.get(ESP32_VIDEO_URL, (response) => {
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
            setTimeout(startVideoProxy, 2000);
        });
    }).on('error', (err) => {
        console.log("ESP32 Video Offline... retrying");
        setTimeout(startVideoProxy, 2000);
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

        console.clear();

        console.log("===== LIVE SENSOR DATA =====");
        console.table(latest);

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

server.listen(3000, () => {

    console.log("================================");
    console.log("Backend Started");
    console.log("API:");
    console.log("http://localhost:3000/api/data");
    console.log("================================");

});