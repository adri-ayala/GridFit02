import serial
import os
import time
import sys
import requests
import json
from pymongo import MongoClient
from datetime import datetime, timezone
import uuid

sys.stdout.flush()

# Configuration
SERIAL_PORT = 'COM3'
BAUD_RATE = 115200
SERVER_URL = "http://localhost:5050/api/student/live-data"

client = MongoClient("mongodb+srv://adrienneayala:Pickles1473@cluster0.mhxjosw.mongodb.net/?retryWrites=true&w=majority&appName=GridFit")
db = client['GridFit']
readings_collection = db['Session']
users_collection = db['Users']  # ✅ Switched from UserStats

RESISTOR_OHMS = 0.10
G_CO2_PER_WH = 0.707

def initialize_daq(ser):
    commands = ['stop', 'clist', 'encode 0', 'ps 0', 'slist 0 1', 'slist 1 2', 'srate 1000', 'start']
    for cmd in commands:
        print(f"Sending command: {cmd}")
        ser.write((cmd + '\r').encode())
        time.sleep(0.1)

def read_dual_channel_voltages(ser):
    data = ser.read(4)
    if len(data) == 4:
        raw1 = int.from_bytes(data[0:2], byteorder='little') & 0x0FFF
        raw2 = int.from_bytes(data[2:4], byteorder='little') & 0x0FFF
        voltage1 = (raw1 / 4095) * 10
        voltage2 = (raw2 / 4095) * 10
        return voltage1, voltage2
    return None, None

def main():
    if len(sys.argv) < 2:
        print("Error: Missing student ID")
        sys.exit(1)

    student_id = sys.argv[1]
    print(f"DAQ Script started for Student ID: {student_id}")

    stop_path = os.path.join(os.path.dirname(__file__), "stop_signal.txt")
    if os.path.exists(stop_path):
        try:
            os.remove(stop_path)
            print("Cleared stop_signal.txt")
        except:
            print(f"Warning: Could not remove stop file at {stop_path} (access denied).")

    session_id = str(uuid.uuid4())
    start_time = time.time()
    total_energy_wh = 0
    total_co2_g = 0
    total_energy = 0

    try:
        print(f"Waiting for {SERIAL_PORT} to become available...")
        timeout = time.time() + 10
        while True:
            try:
                ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
                break
            except serial.SerialException:
                if time.time() > timeout:
                    print("Port still unavailable after timeout.")
                    return
                print(f"Still waiting for {SERIAL_PORT}...")
                time.sleep(1)

        print("Serial port connected.")
        with ser:
            initialize_daq(ser)

            power_readings = []
            reading_interval = 1  # seconds
            average_window = 5  # seconds

            while True:
                if os.path.exists(stop_path):
                    print("Stop signal received. Exiting loop.")
                    os.remove(stop_path)
                    break

                voltage_gen, voltage_shunt = read_dual_channel_voltages(ser)
                if voltage_gen is not None and voltage_shunt is not None:
                    current = voltage_shunt / RESISTOR_OHMS
                    power = voltage_gen * current
                    power_readings.append(power)
                    total_energy += power  # accumulate energy every second

                    if len(power_readings) == average_window:
                        avg_power = sum(power_readings) / len(power_readings)
                        total_energy_wh = total_energy / 3600
                        total_co2_g = total_energy_wh * G_CO2_PER_WH
                        duration = time.time() - start_time

                        payload = {
                            "studentId": student_id,
                            "voltage": voltage_gen,
                            "watts": avg_power,
                            "timestamp": datetime.now().isoformat(),
                            "total_co2": total_co2_g,
                            "generation_rate": (total_energy_wh * 3600 / duration) if duration > 0 else 0,
                            "duration": duration,
                            "total_energy_wh": total_energy_wh
                        }

                        print(f"[{student_id}] Sending 5s average payload: {json.dumps(payload)}")
                        try:
                            requests.post(SERVER_URL, json=payload)
                        except Exception as e:
                            print(f"Failed to send live data: {e}")

                        power_readings.clear()

                else:
                    print("Warning: Voltage read returned None")

                time.sleep(reading_interval)

    except serial.SerialException as e:
        print(f"Serial Error: {e}")
        return

    # Save session summary
    duration = time.time() - start_time
    summary = {
        "studentId": student_id,
        "totalWatts": round(total_energy_wh, 2),
        "totalCO2": round(total_co2_g, 4),
        "duration": int(duration)
    }

    try:
        # ✅ Save session to 'Users' collection, cumulative
        users_collection.update_one(
            {"S_ID": student_id},
            {
                "$inc": {
                    "totalWatts": summary["totalWatts"],
                    "totalCO2": summary["totalCO2"],
                    "duration": summary["duration"]
                }
            },
            upsert=True
        )

        # ✅ Optional: log session to Session collection
        readings_collection.insert_one({
            "studentId": student_id,
            "sessionId": session_id,
            "timestamp": datetime.now(timezone.utc),
            **summary
        })

        print(f"Session summary saved for {student_id}")

    except Exception as e:
        print(f"Failed to save session summary: {e}")

if __name__ == "__main__":
    main()
