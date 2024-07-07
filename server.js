const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const csvFile = path.join(dataDir, 'attendance.csv');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

if (!fs.existsSync(csvFile)) {
    fs.writeFileSync(csvFile, 'Student Name,Parent Name,Action,Time\n');
}

app.post('/log-entry', (req, res) => {
    const { studentName, parentName, action } = req.body;
    const time = new Date().toLocaleString();
    const entry = `${studentName},${parentName},${action},${time}\n`;

    fs.appendFile(csvFile, entry, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log entry.' });
        }
        res.status(200).json({ message: 'Entry logged successfully.' });
    });
});

app.get('/entries', (req, res) => {
    const { date } = req.query;
    const results = [];

    fs.createReadStream(csvFile)
        .pipe(csvParser({ headers: ['Student Name', 'Parent Name', 'Action', 'Time'] }))
        .on('data', (data) => {
            if (new Date(data.Time).toLocaleDateString() === new Date(date).toLocaleDateString()) {
                results.push(data);
            }
        })
        .on('end', () => {
            res.status(200).json(results);
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});