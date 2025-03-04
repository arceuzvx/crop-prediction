// /*
//  * SmartCrop AI - Arduino Uno Sensor Sketch
//  * 
//  * Hardware Setup for Arduino Uno:
//  * - DHT11/DHT22 Temperature & Humidity Sensor -> Digital Pin 2
//  * - Soil Moisture Sensor -> Analog Pin A0
//  * - LDR (Light Dependent Resistor) -> Analog Pin A1
//  * 
//  * Required Library:
//  * - DHT Sensor Library by Adafruit
//  */

// #include "DHT.h"

// // Pin Definitions for Arduino Uno
// const int DHTPIN = 2;          // DHT11 data pin -> Digital Pin 2
// const int SOIL_MOISTURE_PIN = A0;  // Soil moisture sensor -> Analog Pin A0
// const int LIGHT_SENSOR_PIN = A1;   // LDR -> Analog Pin A1

// // Constants
// const int DHTTYPE = DHT11;    // DHT11 sensor (change to DHT22 if using that sensor)
// const long SERIAL_BAUD = 9600;
// const long READING_INTERVAL = 2000;  // 2 seconds between readings

// // Calibration values for soil moisture sensor
// const int SOIL_MOISTURE_AIR = 1023;    // Value in air (dry)
// const int SOIL_MOISTURE_WATER = 0;     // Value in water (wet)

// // Calibration values for LDR (Light Dependent Resistor)
// const int LIGHT_MIN = 0;      // Minimum light value (dark)
// const int LIGHT_MAX = 1023;   // Maximum light value (bright)
// const int LUX_MIN = 0;        // Corresponding lux value for dark
// const int LUX_MAX = 2000;     // Corresponding lux value for bright

// // Initialize DHT sensor
// DHT dht(DHTPIN, DHTTYPE);

// void setup() {
//     // Initialize serial communication
//     Serial.begin(SERIAL_BAUD);
//     while (!Serial) {
//         ; // Wait for serial port to connect
//     }
    
//     // Initialize DHT sensor
//     dht.begin();
    
//     // Configure pins
//     pinMode(SOIL_MOISTURE_PIN, INPUT);
//     pinMode(LIGHT_SENSOR_PIN, INPUT);
    
//     // Print startup message
//     Serial.println(F("SmartCrop AI Sensor System Starting..."));
//     delay(2000);
// }

// float readTemperature() {
//     float temp = dht.readTemperature();
//     if (isnan(temp)) {
//         Serial.println(F("Error reading temperature!"));
//         return -999;
//     }
//     return temp;
// }

// float readHumidity() {
//     float humidity = dht.readHumidity();
//     if (isnan(humidity)) {
//         Serial.println(F("Error reading humidity!"));
//         return -999;
//     }
//     return humidity;
// }

// int readSoilMoisture() {
//     int rawValue = analogRead(SOIL_MOISTURE_PIN);
//     // Convert to percentage (0-100%)
//     int percentage = map(rawValue, SOIL_MOISTURE_AIR, SOIL_MOISTURE_WATER, 0, 100);
//     // Constrain to valid range
//     return constrain(percentage, 0, 100);
// }

// int readLightLevel() {
//     int rawValue = analogRead(LIGHT_SENSOR_PIN);
//     // Convert to lux
//     int lux = map(rawValue, LIGHT_MIN, LIGHT_MAX, LUX_MIN, LUX_MAX);
//     // Constrain to valid range
//     return constrain(lux, LUX_MIN, LUX_MAX);
// }

// void sendSensorData(float temp, float humidity, int soil, int light) {
//     // Format: "temp:25.5,hum:65,soil:42,light:856"
//     Serial.print(F("temp:"));
//     Serial.print(temp);
//     Serial.print(F(",hum:"));
//     Serial.print(humidity);
//     Serial.print(F(",soil:"));
//     Serial.print(soil);
//     Serial.print(F(",light:"));
//     Serial.println(light);
// }

// void loop() {
//     // Read sensor values
//     float temperature = readTemperature();
//     float humidity = readHumidity();
//     int soilMoisture = readSoilMoisture();
//     int lightLevel = readLightLevel();
    
//     // Check if readings are valid
//     if (temperature != -999 && humidity != -999) {
//         sendSensorData(temperature, humidity, soilMoisture, lightLevel);
//     }
    
//     // Wait before next reading
//     delay(READING_INTERVAL);
// }