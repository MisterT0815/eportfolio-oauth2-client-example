const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const app = express();
const { CLIENT_ID, CLIENT_SECRET } = require('./secrets.json')

const REDIRECT_URI = 'http://localhost:8080/oauth2callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get('/', (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/contacts.readonly'];

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

    const people = google.people({ version: 'v1', auth: oauth2Client });

    const peoplelist = await people.people.connections.list({
        resourceName: 'people/me', personFields: 'names', pageSize: 1000
    })

    if (!peoplelist.data.connections || peoplelist.data.connections.length === 0) {
        res.send("No connections found");
    } else {
        let contacts = []
        peoplelist.data.connections.forEach((contact) => {
            if (contact.names && contact.names.length > 0) {
                contacts.push(contact)
            }
        })

        res.send(JSON.stringify(contacts))
    }

});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});
