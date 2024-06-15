const express = require('express');
const csvRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    }
});
  
const upload = multer({ storage: storage });
  
  // Tạo thư mục 'uploads' nếu chưa tồn tại
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

csvRouter.post('/upload', upload.single('data'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {

        console.log(results);
  
        const jsonFilePath = path.join(__dirname, '../uploads', `data.json`);
        fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file.');
        }

  
            res.send('File uploaded and processed successfully.');
        });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('Error processing file.');
    });
});
  
// Endpoint để lấy dữ liệu CSV đã xử lý
csvRouter.get('/data', (req, res) => {
    const filePath = './uploads/data.json';
   
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file.' + err);
      }
      res.json(JSON.parse(data));
    });
  });

module.exports = csvRouter