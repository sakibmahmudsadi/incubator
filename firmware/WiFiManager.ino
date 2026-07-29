#include "Globals.h"

void connectWiFi()
{
    Serial.print("Connecting WiFi");

    WiFi.mode(WIFI_STA);

    WiFi.setSleep(false);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);

        Serial.print(".");
    }

    Serial.println();

    Serial.print("IP Address : ");

    Serial.println(WiFi.localIP());

    Serial.println();
}