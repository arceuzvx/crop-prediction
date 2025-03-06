

// SmartCrop AI - Arduino Uno Sensor Sketch
// Required Libraries:
// 1. DHT Sensor Library by Adafruit
// 2. BH1750 by Christopher Laws
// 3. Wire Library (built-in)

#include <Wire.h>
#include <BH1750.h>
#include <DHT.h>

// Pin Definitions
const int DHTPIN = 2;          // DHT11 data pin -> Digital Pin 2
const int SOIL_MOISTURE_PIN = A0;  // Soil moisture sensor -> Analog Pin A0

// Sensor Configuration
const int DHTTYPE = DHT11;    // DHT11 sensor type
const long SERIAL_BAUD = 9600;
const long READING_INTERVAL = 2000;  // 2 seconds between readings

// Calibration values for soil moisture sensor
const int SOIL_MOISTURE_AIR = 1023;    // Value in air (dry)
const int SOIL_MOISTURE_WATER = 0;     // Value in water (wet)

// Initialize sensors
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

void setup() {
    // Initialize serial communication
    Serial.begin(SERIAL_BAUD);
    
    // Initialize I2C communication
    Wire.begin();
    
    // Initialize sensors
    dht.begin();
    lightMeter.begin();
    
    // Configure pins
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    
    // Wait for serial connection
    delay(2000);
}

float readTemperature() {
    float temp = dht.readTemperature();
    if (isnan(temp)) {
        return -999;
    }
    return temp;
}

float readHumidity() {
    float humidity = dht.readHumidity();
    if (isnan(humidity)) {
        return -999;
    }
    return humidity;
}

int readSoilMoisture() {
    int rawValue = analogRead(SOIL_MOISTURE_PIN);
    // Convert to percentage (0-100%)
    int percentage = map(rawValue, SOIL_MOISTURE_AIR, SOIL_MOISTURE_WATER, 0, 100);
    // Constrain to valid range
    return constrain(percentage, 0, 100);
}

float readLightLevel() {
    float lux = lightMeter.readLightLevel();
    // If reading fails, return error value
    if (lux < 0) {
        return -999;
    }
    return lux;
}

void sendSensorData(float temp, float humidity, int soil, float light) {
    // Format: "temp,humidity,soil_moisture,light_intensity"
    // This matches the Python script's expected format
    Serial.print(temp);
    Serial.print(",");
    Serial.print(humidity);
    Serial.print(",");
    Serial.print(soil);
    Serial.print(",");
    Serial.println(light);
}

void loop() {
    // Read sensor values
    float temperature = readTemperature();
    float humidity = readHumidity();
    int soilMoisture = readSoilMoisture();
    float lightLevel = readLightLevel();
    
    // Only send data if all readings are valid
    if (temperature != -999 && humidity != -999 && lightLevel != -999) {
        sendSensorData(temperature, humidity, soilMoisture, lightLevel);
    }
    
    // Wait before next reading
    delay(READING_INTERVAL);
}