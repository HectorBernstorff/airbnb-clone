const express = require('express')
const app = express()
const cors = require('cors');
const fs = require('fs').promises;

app.use(cors());
app.use(express.json());

app.get('/properties', async (req, res) => {
    try {
      const propertiesData = await fs.readFile('./data.json', 'utf-8');
      res.json(JSON.parse(propertiesData));
    } catch (error) {
      console.error('Error reading data.json:', error);
      res.status(500).json({ error: 'An error occurred while fetching property data' });
    }
  });

  app.get('/properties/:hostname', async (req, res) => {
    const hostname = req.params.hostname;
  
    try {
      const propertiesData = await fs.readFile('./data.json', 'utf-8');
      const jsonData = JSON.parse(propertiesData);
      const property = jsonData.hosts.find((host) => host.hostName === hostname);
  
      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }
  
      res.json(property);
    } catch (error) {
      console.error('Error reading data.json:', error);
      res.status(500).json({ error: 'An error occurred while fetching property data' });
    }
  });
  

  app.post('/updateProperty/:hostname', async (req, res) => {
    const hostname = req.params.hostname;
    
    try {
      // Read the current data from the JSON file
      const currentData = await fs.readFile('./data.json', 'utf-8');
      const parsedData = JSON.parse(currentData);
  
      // Find the host based on the hostname parameter
      const host = parsedData.hosts.find((host) => host.hostName === hostname);
  
      if (!host) {
        res.status(404).json({ error: 'Host not found' });
        return;
      }
  
      // Update the property data with the new values from the request body
      host.hostProperties[0] = req.body.hostProperties[0];
  
      // Write the updated data back to the JSON file
      await fs.writeFile('./data.json', JSON.stringify(parsedData, null, 2), 'utf-8');
  
      res.status(200).json({ message: 'Property data updated successfully' });
    } catch (error) {
      console.error('Error updating property data:', error);
      res.status(500).json({ error: 'An error occurred while updating property data' });
    }
  });
  
  


app.listen(5000, () => {console.log("Served started on port 5000")})