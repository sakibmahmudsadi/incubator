# Complete System Architecture & Wiring Diagram

This diagram maps out the entire Infant Incubator ecosystem, from the physical hardware sensors plugged into the ESP32-CAM, all the way up to the cloud-hosted React dashboard on Cloudflare.

## Full System Flowchart

```mermaid
graph TD
    %% ==========================================
    %% 1. BACKEND LAYER (Node.js Server)
    %% ==========================================
    subgraph "Backend Layer (Node.js Server)"
        Node[Node.js Multiplexer Server]
        Poller[HTTP JSON Poller]
        Streamer[TCP Video Proxy]
    end

    %% ==========================================
    %% 2. HARDWARE LAYER (Incubator Chamber)
    %% ==========================================
    subgraph "Hardware Layer (ESP32-CAM)"
        ESP[ESP32-CAM Microcontroller]
        
        %% Sensors
        DHT[DHT22 Sensor\nAir Temp & Humidity]
        DS[DS18B20 Sensor\nBody Temp]
        MAX[MAX30100 Sensor\nHeart Rate & SpO2]
        
        %% Outputs
        LED_N[Normal Status LED\nGreen/Blue]
        
        subgraph "Warning Circuit (Breadboard)"
            NodeA{Breadboard Row}
            LED_W[Red Warning LED]
            Buzzer[Active Buzzer]
            BJT[2N2222 Transistor]
        end

        %% Sensor Connections
        DHT -->|GPIO 13| ESP
        DS -->|GPIO 14 One-Wire| ESP
        MAX -->|GPIO 15 SDA\nGPIO 12 SCL| ESP
        
        %% Output Connections
        ESP -->|GPIO 3| LED_N
        ESP -->|GPIO 2| NodeA
        
        %% Warning Circuit Routing
        NodeA -->|Resistor| LED_W
        NodeA -->|Resistor| BJT
        BJT -->|Sinks Current| Buzzer
    end

    %% ==========================================
    %% 3. CLOUD / FRONTEND LAYER
    %% ==========================================
    subgraph "Cloud Layer (Internet)"
        CF((Hosting))
        React[React Dashboard UI]
    end

    %% ==========================================
    %% CROSS-LAYER CONNECTIONS
    %% ==========================================
    Poller -->|Reads Port 82 /sensor| ESP
    Streamer -->|Reads Port 81 /stream| ESP
    CF -->|Hosts| React
    Node -.->|WebSocket Push| React
    Node -.->|Video Chunk Stream| React

    %% Legend / Context Styling
    classDef hardware fill:#e2f0d9,stroke:#548235,stroke-width:2px,color:black;
    classDef server fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px,color:black;
    classDef cloud fill:#ffe6cc,stroke:#d79b00,stroke-width:2px,color:black;
    
    class ESP,DHT,DS,MAX,LED_N,LED_W,Buzzer,BJT hardware;
    class Node,Poller,Streamer server;
    class CF,React cloud;
```

### Layer Breakdown

1. **Hardware Layer:** The ESP32-CAM constantly reads data from the three primary sensors using its specific GPIO pins. If the Body Temp falls outside of 30-35°C, it sends a 3.3V signal out of **GPIO 2**, hitting your breadboard node, which simultaneously triggers the Red LED and opens the Transistor to blast the 5V Buzzer.
2. **Backend Layer:** The Node.js server sits on the network and acts as a shield for the ESP32. It asks the ESP32 for data exactly once per second, preventing the tiny microcontroller from crashing under heavy traffic. 
3. **Cloud Layer:** Your React frontend is globally hosted on **Cloudflare Pages**. When a doctor opens the website from anywhere in the world, the website connects back to your Node.js server via WebSockets to stream the live incubator data and video feed seamlessly.
