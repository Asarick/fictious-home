devices = {
    "light1": {"name": "Living Room Light", "type": "light", "status": "off"},
    "thermostat1": {"name": "Thermostat", "type": "thermostat", "status": 22},
    "door1": {"name": "Front Door", "type": "lock", "status": "locked"},
    "tv1": {"name": "Smart TV", "type": "tv", "status": "off"},
    "fan1": {"name": "Ceiling Fan", "type": "fan", "status": "off"},
    "fridge1": {"name": "Fridge", "type": "fridge", "status": "on"},
    "curtain1": {"name": "Curtains", "type": "curtain", "status": "closed"},
    "camera1": {"name": "Security Camera", "type": "camera", "status": "on"}
}

def update_device_status(device_id, new_status):
    if device_id in devices:
        devices[device_id]["status"] = new_status
        return True
    return False
