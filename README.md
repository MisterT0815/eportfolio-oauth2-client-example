# eportfolio-oauth2-client-example
## Getting started
- Install npm
- Create a OAuth2 Client Id and Secret by visiting console.cloud.google.com, creating a project and adding a OAuth 2.0-Client-ID to the project and creating a OAuth consent screen.
- Create a secrets.json file in the directory in the following format:
~~~
{
    "CLIENT_ID": "Your_Client_id",
    "CLIENT_SECRET": "Your_Client_secret"
}
~~~

## Usage
Use:
~~~
npm run start_drive
~~~
to run an app which uses OAuth2 to create a file on the Users google drive.

Use:
~~~
npm run start_contacts
~~~
to run an app which uses OAuth2 to return the users contacts which are saved on google.
