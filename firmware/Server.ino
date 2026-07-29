#include "Globals.h"

void handleSensor()
{
    StaticJsonDocument<256> doc;

    doc["airTemp"]   = airTemp;
    doc["humidity"]  = humidity;
    doc["bodyTemp"]  = bodyTemp;
    doc["heartRate"] = heartRate;
    doc["spo2"]      = spo2;
    doc["uptime"]    = millis();

    String json;
    serializeJson(doc, json);

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
}

void startServer()
{
    server.on("/", HTTP_GET, []()
    {
        server.send(200, "text/plain", "Infant Incubator Server");
    });

    server.on("/sensor", HTTP_GET, handleSensor);

    server.begin();

    Serial.println();
    Serial.println("================================");
    Serial.println("HTTP Server Started");
    Serial.print("Sensor API : http://");
    Serial.print(WiFi.localIP());
    Serial.println(":82/sensor");

    Serial.print("Camera     : http://");
    Serial.print(WiFi.localIP());
    Serial.println("/stream");
    Serial.println("================================");
}

void handleServer()
{
    server.handleClient();
}