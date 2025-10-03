const BASE_URL = "http://127.0.0.1:5000";  // Flask backend

// Create animated device visuals depending on type
function createDeviceAnimation(device) {
  switch (device.type) {
    case "tv":
      return `<div class="tv ${device.status === "on" ? "on" : ""}" id="anim-${device.type}-${device.name}"></div>`;
    case "light":
      return `<div class="light-bulb ${device.status === "on" ? "on" : ""}" id="anim-${device.type}-${device.name}"></div>`;
    case "fan":
      return `<div class="fan ${device.status === "on" ? "spin" : ""}" id="anim-${device.type}-${device.name}">
                <div class="blade"></div><div class="blade"></div><div class="blade"></div>
              </div>`;
    case "curtain":
      return `<div class="curtain ${device.status === "open" ? "open" : ""}" id="anim-${device.type}-${device.name}"></div>`;
    case "window":
      return `<div class="window ${device.status === "open" ? "open" : ""}" id="anim-${device.type}-${device.name}"></div>`;
    case "lock":
      return `<div class="lock-icon ${device.status === "unlocked" ? "open" : "closed"}" id="anim-${device.type}-${device.name}"></div>`;
    case "thermostat":
      return `<div class="thermostat" id="anim-${device.type}-${device.name}">
                <div class="temp-display">${device.status}°C</div>
              </div>`;
    case "camera":
      return `<div class="camera ${device.status === "on" ? "recording" : ""}" id="anim-${device.type}-${device.name}"></div>`;
    case "fridge":
      return `<div class="fridge ${device.status === "open" ? "open" : ""}" id="anim-${device.type}-${device.name}"></div>`;
    default:
      return "";
  }
}

// Load all devices
async function loadDevices() {
  try {
    const res = await fetch(`${BASE_URL}/api/devices`);
    const devices = await res.json();

    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = "";

    Object.entries(devices).forEach(([id, device]) => {
      const card = document.createElement("div");
      card.className = "device-card";

      let statusClass = (device.status === "on" || device.status === "unlocked" || device.status === "open") 
        ? "status-on" : "status-off";

      card.innerHTML = `
        <h2>${device.name}</h2>
        ${createDeviceAnimation(device)}
        <p>Type: ${device.type}</p>
        <p>Status: <span id="status-${id}" class="${statusClass}">${device.status}</span></p>
      `;

      // Add button controls
      if (["light", "lock", "tv", "fan", "curtain", "window", "camera", "fridge"].includes(device.type)) {
        const btn = document.createElement("button");
        btn.className = (device.status === "on" || device.status === "unlocked" || device.status === "open") 
          ? "on" : "off";
        btn.textContent = device.status === "on" || device.status === "unlocked" || device.status === "open"
          ? "Turn Off / Close / Lock"
          : "Turn On / Open / Unlock";
        btn.onclick = () => toggleDevice(id, device.type);
        card.appendChild(btn);
      }

      // Thermostat slider
      if (device.type === "thermostat") {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 16;
        slider.max = 30;
        slider.value = device.status;
        slider.oninput = (e) => updateThermostat(id, e.target.value);
        card.appendChild(slider);
      }

      dashboard.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading devices:", err);
  }
}

// Toggle device states
async function toggleDevice(id, type) {
  const current = document.getElementById("status-" + id).innerText;
  let newStatus;

  if (["light", "tv", "fan", "camera"].includes(type)) {
    newStatus = current === "on" ? "off" : "on";
  }
  if (type === "lock") newStatus = current === "locked" ? "unlocked" : "locked";
  if (["curtain", "window", "fridge"].includes(type)) newStatus = current === "closed" ? "open" : "closed";

  await fetch(`${BASE_URL}/api/device/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({status: newStatus})
  });

  loadDevices();
}

// Thermostat handler
async function updateThermostat(id, value) {
  await fetch(`${BASE_URL}/api/device/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({status: parseInt(value)})
  });
  loadDevices();
}

// Initial load
loadDevices();
