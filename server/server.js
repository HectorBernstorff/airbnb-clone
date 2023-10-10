const express = require('express')
const app = express()
const cors = require('cors');
const fs = require('fs').promises;
const fileUpload = require('express-fileupload');
const path = require('path');


app.use(cors());
app.use(express.json());
app.use(fileUpload());

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


  app.post('/upload/:hostname', async (req, res) => {
    const hostname = req.params.hostname;
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
      }
  
      const uploadedFile = req.files.uploadedFile;
      const fileName = uploadedFile.name;
      const uploadPath = path.join(__dirname, 'uploads', fileName);
  
      // Move the uploaded file to the "uploads" folder
      uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
          console.error('Error uploading file:', err);
          return res.status(500).json({ error: 'Error uploading file.' });
        }
  
        // Read the current data from the data.json file
        try {
          const dataPath = path.join(__dirname, 'data.json');
          const jsonData = await fs.readFile(dataPath, 'utf-8');
          const parsedData = JSON.parse(jsonData);
  
          // Find the host by hostname (assuming hostname is unique)
          const host = parsedData.hosts.find((host) => host.hostName === hostname);
  
          if (!host) {
            return res.status(404).json({ error: 'Host not found' });
          }
  
          // Append the uploaded file name to the "pictures" array
          host.hostProperties[0].pictures.push(fileName);
  
          // Write the updated data back to the data.json file
          await fs.writeFile(dataPath, JSON.stringify(parsedData, null, 2), 'utf-8');
  
          res.status(200).json({ message: 'File uploaded successfully.' });
        } catch (error) {
          console.error('Error updating data.json:', error);
          res.status(500).json({ error: 'Error updating data.json.' });
        }
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });
  
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.delete('/deleteImage/:hostname/:imageName', async (req, res) => {
    const hostname = req.params.hostname;
    const imageName = req.params.imageName;
  
    try {
      // Read the current data from the data.json file
      const dataPath = path.join(__dirname, 'data.json');
      const jsonData = await fs.readFile(dataPath, 'utf-8');
      const parsedData = JSON.parse(jsonData);
  
      // Find the host by hostname (assuming hostname is unique)
      const host = parsedData.hosts.find((host) => host.hostName === hostname);
  
      if (!host) {
        return res.status(404).json({ error: 'Host not found' });
      }
  
      // Remove the image name from the "pictures" array
      host.hostProperties[0].pictures = host.hostProperties[0].pictures.filter(
        (picture) => picture !== imageName
      );
  
      // Write the updated data back to the data.json file
      await fs.writeFile(dataPath, JSON.stringify(parsedData, null, 2), 'utf-8');
  
      // Remove the image file from the "uploads" folder
      const imagePath = path.join(__dirname, 'uploads', imageName);
      await fs.unlink(imagePath);
  
      res.status(200).json({ message: 'Image deleted successfully.' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Error deleting image.' });
    }
  });
  
  


app.listen(5000, () => {console.log("Served started on port 5000")})