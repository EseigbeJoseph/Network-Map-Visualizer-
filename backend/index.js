const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(cors());

const externalApiUrl = 'http://localhost:20110/switch-info';

app.get('/switch-info', async (req, res) => {
    try {
      const response = await fetch(externalApiUrl);
      const apiData = await response.json();
      console.log('Raw API Data:', JSON.stringify(apiData, null, 2));
  
      const transformedData = {};
  
      apiData.forEach(sw => {
        const switchEntries = Object.entries(sw.switch_response);
        
        switchEntries.forEach(([switchName, details]) => {
          transformedData[switchName] = {
            system_info: {
              os_version: details.system_info?.os_version || 'Unknown',
              model: details.system_info?.model || 'Unknown',
              uptime: details.system_info?.uptime || 'Unknown'
            },
            interfaces: {}
          };
  
          if (details.interfaces && typeof details.interfaces === 'object') {
            Object.entries(details.interfaces).forEach(([interfaceName, intf]) => {
              transformedData[switchName].interfaces[interfaceName] = {
                name: interfaceName,
                description: intf.description || '',
                oper_status: intf.oper_status || 'down',
                speed_mbps: parseInt(intf.speed_mbps || 0),
                duplex: intf.duplex || 'unknown',
                ipv4: intf.ipv4 || '',
                neighbor: intf.neighbor || '',
                counters: {
                  in_bytes: parseInt(intf.counters?.in_bytes || 0),
                  out_bytes: parseInt(intf.counters?.out_bytes || 0),
                  in_errors: parseInt(intf.counters?.in_errors || 0),
                  out_errors: parseInt(intf.counters?.out_errors || 0)
                }
              };
            });
          }
        });
      });
  
      console.log('Transformed Data:', JSON.stringify(transformedData, null, 2));
  
      res.json(transformedData);
    } catch (error) {
      console.error('Error fetching or transforming switch data:', error);
      res.status(500).json({ error: 'Failed to fetch or process switch data' });
    }
  });
  

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
