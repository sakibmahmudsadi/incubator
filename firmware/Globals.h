#ifndef GLOBALS_H
#define GLOBALS_H

//================ Libraries ================

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>

#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include "MAX30100_PulseOximeter.h"

#include "esp_camera.h"
#include "esp_http_server.h"

//================ WiFi =====================

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

//================ Pins =====================

// DHT22
#define DHT_PIN       13
#define DHT_TYPE      DHT22

// DS18B20
#define ONE_WIRE_PIN  14

// MAX30100
#define I2C_SDA       15
#define I2C_SCL       12

//================ Camera Pins (AI Thinker) =====================

#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5

#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

//================ Objects ==================

DHT dht(DHT_PIN, DHT_TYPE);

OneWire oneWire(ONE_WIRE_PIN);

DallasTemperature ds18b20(&oneWire);

PulseOximeter pox;

// HTTP Server (port 82 to avoid conflict with camera on port 80)
WebServer server(82);

//================ Variables ================

float airTemp = 0;
float humidity = 0;
float bodyTemp = 0;

float heartRate = 0;
float spo2 = 0;

int bodyTempErrorCount = 0;

//================ FreeRTOS =================

TaskHandle_t sensorTaskHandle = NULL;
TaskHandle_t pulseTaskHandle = NULL;

//================ Functions ================

// WiFi
void connectWiFi();

// Sensors
void initSensors();

// FreeRTOS Tasks
void pulseTask(void *parameter);
void sensorTask(void *parameter);

// HTTP Server
void startServer();
void handleServer();

// Camera
void startCameraServer();

#endif