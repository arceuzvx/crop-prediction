#include <Wire.h>
#include <BH1750.h>
#include <DHT.h>

// Define DHT11 sensor pin
#define DHTPIN 2  
#define DHTTYPE DHT11  
DHT dht(DHTPIN, DHTTYPE);

// Initialize BH1750 Light Sensor
BH1750 lightMeter;

// Define Soil Moisture Sensor pin
#define SOIL_MOISTURE_PIN A0

void setup() {
    Serial.begin(9600);

    // Initialize sensors
    dht.begin();
    Wire.begin();
    lightMeter.begin();

    Serial.println("Sensors Initialized...");
}

void loop() {
    // Read Temperature & Humidity
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    // Read Light Intensity
    float lux = lightMeter.readLightLevel();

    // Read Soil Moisture
    int soilMoisture = analogRead(SOIL_MOISTURE_PIN);
    
    // Check if DHT11 reading is valid
    if (isnan(humidity) || isnan(temperature)) {
        Serial.println("Failed to read from DHT11 sensor!");
        return;
    }

    // Print Data to Serial Monitor
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C | Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

    Serial.print("Light Intensity: ");
    Serial.print(lux);
    Serial.println(" lx");

    Serial.print("Soil Moisture: ");
    Serial.println(soilMoisture);

    Serial.println("----------------------");

    // Wait 2 seconds before the next reading
    delay(2000);
}