#include "Globals.h"

void setup()
{
    Serial.begin(115200);

    connectWiFi();

    Serial.println("WiFi OK");

    if (!initCamera())
    {
        Serial.println("Camera Failed");

        while (true)
            delay(1000);
    }

    Serial.println("Camera OK");


    startCameraServer();

    Serial.println("Camera Server OK");

    initSensors();

    Serial.println("Sensors OK");

    startServer();

    // High-priority pulse task: ONLY pox.update()
    BaseType_t pulseResult = xTaskCreatePinnedToCore(
        pulseTask,
        "PulseTask",
        4096,
        NULL,
        5,
        &pulseTaskHandle,
        1
    );

    Serial.print("Pulse Task Result: ");
    Serial.println(pulseResult);

    // Low-priority sensor task: DHT22, DS18B20, serial
    BaseType_t sensorResult = xTaskCreatePinnedToCore(
        sensorTask,
        "SensorTask",
        4096,
        NULL,
        1,
        &sensorTaskHandle,
        1
    );

    Serial.print("Sensor Task Result: ");
    Serial.println(sensorResult);

}

void loop()
{
    // Core 0:
    // WiFi
    // HTTP Server
    // Camera Server

    handleServer();

    delay(1);
}