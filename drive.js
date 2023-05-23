const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const app = express();
const { CLIENT_ID, CLIENT_SECRET } = require('./secrets.json')

const REDIRECT_URI = 'http://localhost:8080/oauth2callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get('/', (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/drive.file'];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });

    res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    console.log("here")
    const fileMetadata = {
        name: 'My Report',
    };

    const media = {
        mimeType: 'text/plain',
        body: 'Hello, World!',
    };

    const { data } = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    console.log(`File created with ID: ${data.id}`)
    res.send(`File created with ID: ${data.id}`);
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});
