
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/pair', (req, res) => {
    let codeData = { pairingCode: "Not generated yet." };
    try {
        const fileData = fs.readFileSync('pair-code.json');
        codeData = JSON.parse(fileData);
    } catch (err) {
        console.log("pair-code.json not ready yet.");
    }
    res.send(`<h1>WhatsApp Pairing Code</h1>
              <p style="font-size:2em;">${codeData.pairingCode || "Not generated yet."}</p>
              <p>Open WhatsApp → Linked Devices → Link with code.</p>`);
});

app.listen(PORT, () => {
    console.log(`🌐 Pair site running on http://localhost:${PORT}/pair`);
});
