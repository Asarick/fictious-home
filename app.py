from flask import Flask, jsonify, request, render_template, send_from_directory
from devices import devices, update_device_status
from automation import automation_rules, add_rule
import os

app = Flask(__name__, template_folder=".", static_folder=".")

@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")

@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")

@app.route("/")
def home():
    return render_template("index.html")

# Get all devices
@app.route("/api/devices", methods=["GET"])
def get_devices():
    return jsonify(devices)

# Update a device
@app.route("/api/device/<device_id>", methods=["PUT"])
def update_device(device_id):
    data = request.json
    if update_device_status(device_id, data.get("status")):
        return jsonify({"message": "Updated", "device": devices[device_id]})
    return jsonify({"error": "Device not found"}), 404

# Get automation rules
@app.route("/api/automation", methods=["GET"])
def get_automation():
    return jsonify(automation_rules)

# Add automation rule
@app.route("/api/automation", methods=["POST"])
def create_automation():
    rule = request.json
    return jsonify(add_rule(rule))

if __name__ == "__main__":
    app.run(debug=True)
