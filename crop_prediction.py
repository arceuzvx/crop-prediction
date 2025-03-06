import serial
import json
import time
import google.generativeai as genai
from serial.tools import list_ports
import logging
from datetime import datetime
from flask import Flask, render_template, jsonify
from threading import Thread

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('crop_prediction.log'),
        logging.StreamHandler()
    ]
)

# Initialize Flask app
app = Flask(__name__, template_folder='.', static_folder='.')

# Global variable to store latest prediction
latest_prediction = {
    "recommended_crops": [],
    "explanation": "Waiting for sensor data...",
    "conditions_summary": "Initializing...",
    "sensor_data": {
        "temperature": 0,
        "humidity": 0,
        "soil_moisture": 0,
        "light_intensity": 0
    }
}

class CropPredictor:
    def __init__(self, api_key, port=None, baud_rate=9600):
        """Initialize the crop predictor with Google AI Studio API key and serial settings."""
        self.api_key = api_key
        self.port = port
        self.baud_rate = baud_rate
        self.serial_connection = None
        
        # Configure Google AI Studio
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel('gemini-pro')
        
    def find_arduino_port(self):
        """Automatically find the Arduino port."""
        arduino_ports = [
            p.device
            for p in list_ports.comports()
            if 'Arduino' in p.description or 'CH340' in p.description  # CH340 is a common Arduino clone chip
        ]
        
        if not arduino_ports:
            raise ConnectionError("No Arduino found. Please check the connection.")
        
        return arduino_ports[0]
    
    def connect_to_arduino(self):
        """Establish connection with Arduino."""
        try:
            if not self.port:
                self.port = self.find_arduino_port()
            
            self.serial_connection = serial.Serial(self.port, self.baud_rate, timeout=1)
            time.sleep(2)  # Wait for Arduino to reset
            logging.info(f"Connected to Arduino on port {self.port}")
            
        except Exception as e:
            logging.error(f"Failed to connect to Arduino: {e}")
            raise
    
    def read_sensor_data(self):
        """Read and parse sensor data from Arduino."""
        try:
            if not self.serial_connection:
                raise ConnectionError("Not connected to Arduino")
            
            line = self.serial_connection.readline().decode().strip()
            if not line:
                return None
            
            # Parse comma-separated values
            temp, humidity, soil_moisture, light = map(float, line.split(','))
            
            return {
                'temperature': temp,
                'humidity': humidity,
                'soil_moisture': soil_moisture,
                'light_intensity': light
            }
            
        except Exception as e:
            logging.error(f"Error reading sensor data: {e}")
            return None
    
    def predict_crops(self, sensor_data):
        """Predict suitable crops using Google AI Studio."""
        try:
            prompt = f"""
            Based on these agricultural sensor readings from India:
            - Temperature: {sensor_data['temperature']}°C
            - Humidity: {sensor_data['humidity']}%
            - Soil Moisture: {sensor_data['soil_moisture']}%
            - Light Intensity: {sensor_data['light_intensity']} lux

            Please analyze these conditions and suggest suitable crops that can be grown in India.
            Consider the following factors:
            1. These are real-time sensor readings
            2. Focus on crops that are commonly grown in India
            3. Consider the current environmental conditions
            4. Suggest crops that would thrive in these specific conditions

            Return the response in this JSON format:
            {
                "recommended_crops": ["crop1", "crop2", "crop3"],
                "explanation": "Brief explanation of why these crops are suitable",
                "conditions_summary": "Summary of current conditions"
            }
            """
            
            response = self.model.generate_content(prompt)
            prediction = json.loads(response.text)
            
            # Update global prediction
            global latest_prediction
            latest_prediction = prediction
            latest_prediction['sensor_data'] = sensor_data
            
            return prediction
            
        except Exception as e:
            logging.error(f"Error predicting crops: {e}")
            return {
                "recommended_crops": [],
                "explanation": f"Error in prediction: {str(e)}",
                "conditions_summary": "Error analyzing conditions"
            }
    
    def save_prediction(self, sensor_data, prediction):
        """Save sensor data and predictions to a log file."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {
            "timestamp": timestamp,
            "sensor_data": sensor_data,
            "prediction": prediction
        }
        
        with open('predictions_log.json', 'a') as f:
            json.dump(log_entry, f)
            f.write('\n')
    
    def run(self):
        """Main loop to continuously read sensor data and make predictions."""
        try:
            self.connect_to_arduino()
            logging.info("Starting crop prediction system...")
            
            while True:
                sensor_data = self.read_sensor_data()
                if sensor_data:
                    logging.info(f"Sensor Data: {sensor_data}")
                    
                    prediction = self.predict_crops(sensor_data)
                    logging.info(f"Prediction: {prediction}")
                    
                    self.save_prediction(sensor_data, prediction)
                    
                time.sleep(2)  # Wait before next reading
                
        except KeyboardInterrupt:
            logging.info("Stopping crop prediction system...")
        finally:
            if self.serial_connection:
                self.serial_connection.close()
                logging.info("Closed Arduino connection")

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/get_prediction')
def get_prediction():
    """Return the latest prediction as JSON."""
    return jsonify(latest_prediction)

def run_flask():
    """Run the Flask web server."""
    app.run(host='0.0.0.0', port=5000)

if __name__ == "__main__":
    # Replace with your Google AI Studio API key
    API_KEY = "YOUR_GOOGLE_AI_STUDIO_API_KEY"
    
    try:
        # Start the web server in a separate thread
        web_thread = Thread(target=run_flask)
        web_thread.daemon = True
        web_thread.start()
        
        # Start the crop predictor
        predictor = CropPredictor(API_KEY)
        predictor.run()
    except Exception as e:
        logging.error(f"Application error: {e}") 