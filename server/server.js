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

  app.post('/updateProperty', async (req, res) => {
    try {
      // Read the current data from the JSON file
      const currentData = await fs.readFile('./data.json', 'utf-8');
      const parsedData = JSON.parse(currentData);
  
      // Update the property data with the new values from the request body
      parsedData.hosts[0].hostProperties[0] = req.body.hostProperties[0];
  
      // Write the updated data back to the JSON file
      await fs.writeFile('./data.json', JSON.stringify(parsedData, null, 2), 'utf-8');
  
      res.status(200).json({ message: 'Property data updated successfully' });
    } catch (error) {
      console.error('Error updating property data:', error);
      res.status(500).json({ error: 'An error occurred while updating property data' });
    }
  });
  


app.listen(5000, () => {console.log("Served started on port 5000")})