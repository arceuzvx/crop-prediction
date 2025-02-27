# SmartCrop AI: Smart Crop Prediction System

SmartCrop AI is an IoT-based smart agriculture system that monitors environmental parameters and provides crop recommendations based on real-time sensor data. It integrates an Arduino Uno with multiple sensors, a web interface, and Firebase for user authentication and alert management.

## Overview

The system continuously measures:
- **Temperature & Humidity:** Using a DHT11 sensor.
- **Ambient Light:** With a BH1750 sensor.
- **Soil Moisture:** Via a soil moisture sensor.

These sensor readings are sent to Firebase and displayed in an interactive web dashboard that features real-time charts, crop prediction recommendations, and environmental alerts. The web interface also includes a login page, so users can create accounts and receive personalized alerts when conditions go outside the optimal ranges for crop growth.

## Features

- **Real-Time Sensor Dashboard:** Visualizes temperature, humidity, soil moisture, and light intensity using interactive charts.
- **Crop Recommendations:** Provides AI-powered suggestions on which crops (e.g., corn, wheat, potato, etc.) are best suited to the current environmental conditions.
- **Alert System:** Sends alerts when sensor values fall outside predefined thresholds.
- **User Authentication:** Uses Firebase Authentication to allow users to register and log in, ensuring that alerts and data are personalized.
- **Arduino Integration:** An Arduino Uno reads sensor data and uploads values to Firebase, triggering alerts based on set thresholds.
- **Configurable Settings:** Users can adjust sampling rates, alert thresholds, and AI model settings through the web interface.

## Components

- **Hardware:**
  - Arduino Uno
  - DHT11 Temperature & Humidity Sensor
  - BH1750 Light Sensor
  - Soil Moisture Sensor
  - WiFi Module/Shield for Arduino (compatible with your WiFi library)
  - Arduino connectors and jumper wires
- **Software:**
  - Arduino IDE
  - Firebase Realtime Database & Authentication
  - HTML, CSS, and JavaScript (Chart.js for charts)
  - Required libraries: [FirebaseArduino](https://github.com/FirebaseExtended/firebase-arduino), [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library), [BH1750 Library](https://github.com/claws/BH1750)

## Setup Instructions

### 1. Hardware Setup

- **Connect the Sensors:**
  - **DHT11:** Connect the data pin to digital pin 2 on the Arduino.
  - **BH1750:** Connect to the I2C bus (A4 for SDA, A5 for SCL on the UNO).
  - **Soil Moisture Sensor:** Connect to analog pin A0.
- **WiFi Module:** Ensure your Arduino is equipped with a compatible WiFi shield or module.

### 2. Arduino Code Configuration

- Download and install the required Arduino libraries.
- Replace the placeholder WiFi and Firebase credentials in the Arduino sketch with your own:
  - **SSID & Password:** Your WiFi network credentials.
  - **Firebase Host & Auth:** Your Firebase Realtime Database URL and secret.
- Upload the Arduino code to your board. The code reads sensor values, maps the soil moisture reading to a percentage, checks values against thresholds, sends sensor data to Firebase, and issues alerts if needed.

### 3. Firebase Setup

- **Realtime Database:** Create a Firebase project and configure a realtime database.
- **Authentication:** Enable Firebase Authentication to allow user registration and login.
- Update your project’s Firebase rules as needed to secure the data.

### 4. Web Interface

- The repository includes the following files:
  - **index.html:** Contains the structure of the dashboard, crop prediction, Arduino status, and settings.
  - **script.js:** Handles chart initialization (using Chart.js), sensor simulation, and crop prediction refresh.
  - **styles.css:** Provides styling for the dashboard and web interface.
- Host these files on a web server or Firebase Hosting.
- The web app listens to changes in the Firebase database, updating charts and alert notifications in real time.

## Usage

1. **Power Up:** Start your Arduino setup with all sensors connected.
2. **Data Upload:** Sensor readings are continuously uploaded to Firebase.
3. **Web Dashboard:** Log in via the web interface to view real-time charts, sensor statuses, and crop recommendations.
4. **Alerts & Configuration:** Adjust alert thresholds and sampling rates via the settings page. Receive alerts if sensor readings fall outside the optimal ranges.

## Team members
- Kanchan Dutta
- Ritesh Chatterjee
- Sumantra Das
- Subarnak Chakraborty
- Soumyashree Biswas
- Shreya Dutta