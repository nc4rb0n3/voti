const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Funzione per aggiornare il file Excel
function updateExcel(city, candidate) {
    const filePath = path.join(__dirname, 'public', 'votazioni.xlsx');
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        workbook = xlsx.utils.book_new();
    }

    // Verifica se il foglio di lavoro esiste
    let worksheet = workbook.Sheets[city];
    if (!worksheet) {
        worksheet = xlsx.utils.aoa_to_sheet([['Candidato', 'Voti']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, city);
    }

    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Trova il candidato e aggiorna i voti
    let found = false;
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === candidate) {
            data[i][1] = (data[i][1] || 0) + 1;
            found = true;
            break;
        }
    }

    // Aggiungi il candidato se non trovato
    if (!found) {
        data.push([candidate, 1]);
    }

    // Aggiorna il foglio di lavoro con i nuovi dati
    const newWorksheet = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets[city] = newWorksheet;
    xlsx.writeFile(workbook, filePath);
}

// Endpoint per registrare il voto
app.post('/vota', (req, res) => {
    const { city, candidate } = req.body;
    if (!city || !candidate) {
        return res.status(400).json({ error: 'City and candidate are required' });
    }

    try {
        updateExcel(city, candidate);
        res.json({ success: true, message: 'Voto registrato con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante l\'aggiornamento del file Excel' });
    }
});

app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
});
