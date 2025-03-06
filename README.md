# SmartCrop AI - Intelligent Farming Solutions

SmartCrop AI is an intelligent crop prediction system that combines Arduino-based sensor data with AI to provide optimal crop recommendations for farmers.

## Features

- Real-time environmental monitoring (temperature, humidity, soil moisture, light intensity)
- AI-powered crop recommendations
- Interactive web dashboard
- Arduino integration for sensor data collection
- Modern, responsive user interface

## Prerequisites

- Python 3.8 or higher
- Arduino Uno or compatible board
- Required sensors:
  - DHT11/DHT22 (Temperature & Humidity)
  - Soil Moisture Sensor
  - BH1750 Light Intensity Sensor
- Google AI Studio API key

## Hardware Setup

1. Connect the sensors to your Arduino:
   - DHT sensor: Digital Pin 2
   - Soil Moisture sensor: Analog Pin A0
   - BH1750 Light sensor: I2C (SDA/SCL pins)

2. Upload the `arduino_sensor_sketch.ino` to your Arduino board

## Software Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd smartcrop-ai
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
   - Create a `.env` file in the project root
   - Add your Google AI Studio API key:
```
GOOGLE_API_KEY=your_api_key_here
```

## Running the Application

1. Ensure your Arduino is connected and running the sensor sketch

2. Start the Python application:
```bash
python crop_prediction.py
```

3. Access the web interface:
   - Open `landing.html` in your browser for the landing page
   - Click "Go to Dashboard" or access `index.html` directly for the main dashboard
   - The application will be running on `http://localhost:5000`

## Project Structure

```
smartcrop-ai/
├── arduino_sensor_sketch.ino  # Arduino code for sensors
├── crop_prediction.py         # Main Python application
├── requirements.txt           # Python dependencies
├── landing.html              # Landing page
├── index.html                # Dashboard interface
├── landing-styles.css        # Landing page styles
├── styles.css                # Dashboard styles
├── script.js                 # Dashboard JavaScript
└── .env                      # Environment variables (create this)
```

## Features in Detail

### 1. Sensor Monitoring
- Real-time temperature readings
- Humidity monitoring
- Soil moisture detection
- Light intensity measurement

### 2. AI Analysis
- Environmental condition analysis
- Crop suitability prediction
- Personalized recommendations
- Real-time updates

### 3. Web Dashboard
- Modern, responsive design
- Real-time data visualization
- Easy-to-read recommendations
- Arduino connection management

## Troubleshooting

1. **Arduino Connection Issues**
   - Verify the correct COM port is selected
   - Check sensor connections
   - Ensure Arduino sketch is properly uploaded

2. **Sensor Reading Errors**
   - Verify sensor wiring
   - Check power supply
   - Ensure proper sensor calibration

3. **Web Interface Issues**
   - Clear browser cache
   - Check if Python server is running
   - Verify port 5000 is available

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Arduino Community
- Google AI Studio
- Flask Framework
- Contributors and testers