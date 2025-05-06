 HEAD

# LLDP Network Map Visualizer

This is a full-stack web application that visualizes network switches using LLDP (Link Layer Discovery Protocol) data. The backend is built with Node.js and Express, and the frontend is built with React. Switches are displayed on a canvas, can be dragged and resized, and show detailed interface information in a popup when hovered.

## Features

- Fetches LLDP data from a local API (`http://localhost:20110/lldp-info`).
- Displays each switch as a draggable, resizable element on the canvas.
- Hovering over a switch reveals detailed interface data in a scrollable popup below each switch.
- Refreshes LLDP data automatically every 5 seconds.
- Displays multiple switches and their interfaces dynamically from the backend.
- The frontend allows users to view and interact with the LLDP information such as status, speed, IP address, and neighboring switches.

## API Details

The frontend fetches switch data from this backend endpoint:

**GET** `/lldp-info`  
- This API returns LLDP data for all switches in the network, including details like system info (e.g., OS version, uptime, model) and interfaces (e.g., description, IP address, speed).

### Example Response Format:

```json
[
  {
    "id": "Switch1",
    "switch_response": {
      "system_info": {
        "os_version": "16.12.5",
        "model": "WS-C3850-48P",
        "uptime": "15d 23h 12m"
      },
      "interfaces": {
        "GigabitEthernet0/1": {
          "description": "Uplink to Switch2",
          "type": "ianaift:ethernetCsmacd",
          "admin_status": "up",
          "oper_status": "up",
          "speed_mbps": 1000,
          "duplex": "full",
          "mac_address": "00-AA-BB-CC-DD-01",
          "ipv4": "192.168.12.1/30",
          "neighbor": "Switch2:GigabitEthernet0/1 (Bridge, Router)",
          "counters": {
            "in_bytes": 123456789,
            "out_bytes": 987654321,
            "in_errors": 5,
            "out_errors": 2
          }
        }
      }
    }
  }
]
```

### Important Fields in the Response:
- **system_info**: Contains information about the switch's OS version, model, and uptime.
- **interfaces**: A dictionary where each key represents an interface (e.g., `GigabitEthernet0/1`) and contains details such as description, status, speed, and neighbor.

## Project Structure

### Backend:

```
/backend
├── index.js           # Express server to fetch and format LLDP data
└── package.json       # Backend dependencies and scripts
```

### Frontend:

```
/frontend
├── App.js             # Main app component
├── NetworkMap.js      # Visualization and logic for displaying switches
├── SwitchInterface.js # Interface details page for showing switch data
├── Navbar.js          # Navigation bar component
├── NetworkMap.css     # Styling for the canvas and popup
└── package.json       # Frontend dependencies and scripts
```

## How to Run

1. **Start the Backend:**

   - Navigate to the `/backend` directory.
   - Install dependencies and start the server:

   ```bash
   cd backend
   npm install
   node index.js
   ```

2. **Start the Frontend:**

   - Install dependencies and start the React development server:

   ```bash
   npm install
   npm start
   ```

   The frontend runs at [http://localhost:3000](http://localhost:3000) and fetches LLDP data from the backend at [http://localhost:5000](http://localhost:5000).

3. **Ensure your LLDP data provider (e.g., mock server) is running at** `http://localhost:20110/lldp-info`.

## Prerequisites

- Node.js v14+ installed.
- LLDP data service running at `http://localhost:20110/lldp-info`.

## Notes

- The frontend displays a map with draggable and resizable switches.
- Hovering over a switch displays a popup showing interface details like IP address, speed, status, and connected neighbor.
- The backend serves LLDP data, which the frontend visualizes in real-time, updating every 5 seconds.
 28b3a20 (Initial project commit: LLDP Network Map Visualizer)
