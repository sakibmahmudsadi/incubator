#include "Globals.h"

void onBeatDetected()
{
    Serial.println("♥ Beat Detected!");
}

void initSensors()
{
    Wire.begin(I2C_SDA, I2C_SCL);

    dht.begin();

    ds18b20.begin();

    if (!pox.begin())
    {
        Serial.println("MAX30100 Failed");

        while (true)
            delay(1000);
    }

    pox.setIRLedCurrent(MAX30100_LED_CURR_27_1MA);

    pox.setOnBeatDetectedCallback(onBeatDetected);

    // --- EXTERNAL LED SETUP ---
    // Note: If you don't have the LEDs plugged in yet, you can safely leave this 
    // code as-is. It won't hurt the ESP32 to turn these pins ON/OFF with nothing attached.
    pinMode(3, OUTPUT); // U0R - Normal Temp
    pinMode(2, OUTPUT); // GPIO 2 - Warning Temp (Using 2 instead of 4 to avoid the flash)
    
    // Turn both OFF initially
    digitalWrite(3, LOW);
    digitalWrite(2, LOW);
    // --------------------------

    Serial.println("Sensors Initialized");
}

// High-priority task: ONLY pox.update()
void pulseTask(void *parameter)
{
    Serial.print("Pulse Task Running on Core ");
    Serial.println(xPortGetCoreID());

    while (true)
    {
        pox.update();

        heartRate = pox.getHeartRate();
        spo2 = pox.getSpO2();

        vTaskDelay(1);
    }
}

// Low-priority task: DHT22, DS18B20, serial output
void sensorTask(void *parameter)
{
    Serial.print("Sensor Task Running on Core ");
    Serial.println(xPortGetCoreID());

    unsigned long lastPrint = 0;
    unsigned long lastDHT = 0;
    unsigned long lastDS = 0;

    while (true)
    {
        // Read DHT22 every 2 seconds
        if (millis() - lastDHT >= 2000)
        {
            lastDHT = millis();

            airTemp = dht.readTemperature();
            humidity = dht.readHumidity();

            // --- EXTERNAL LED LOGIC ---
            // Warning if Body Temp is outside 30-35
            bool bodySafe = (bodyTemp >= 30.0 && bodyTemp <= 35.0);

            if (bodySafe) {
                digitalWrite(3, HIGH); // Turn ON Normal LED (GPIO 3)
                digitalWrite(2, LOW);  // Turn OFF Warning LED (GPIO 2)
            } else {
                digitalWrite(3, LOW);  // Turn OFF Normal LED (GPIO 3)
                digitalWrite(2, HIGH); // Turn ON Warning LED (GPIO 2)
            }
            // --------------------------
        }

        // Read DS18B20 every second
        if (millis() - lastDS >= 1000)
        {
            lastDS = millis();

            ds18b20.requestTemperatures();
            float tempRead = ds18b20.getTempCByIndex(0);
            
            if (tempRead <= -127.00) {
                bodyTempErrorCount++;
                if (bodyTempErrorCount < 10) {
                    bodyTemp = 0.00;
                } else {
                    bodyTemp = -127.00;
                }
            } else {
                bodyTempErrorCount = 0;
                bodyTemp = tempRead;
            }
        }

        // Print every second
        if (millis() - lastPrint >= 1000)
        {
            lastPrint = millis();

            Serial.print("HR: ");
            Serial.print(heartRate);

            Serial.print("  SpO2: ");
            Serial.print(spo2);

            Serial.print("  Air: ");
            Serial.print(airTemp);

            Serial.print("  Hum: ");
            Serial.print(humidity);

            Serial.print("  Body: ");
            if (bodyTempErrorCount >= 10) {
                Serial.println("disconnected");
            } else {
                Serial.println(bodyTemp);
            }
        }

        vTaskDelay(100);
    }
}
