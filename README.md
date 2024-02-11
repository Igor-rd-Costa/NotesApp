# NotesApp
A project I started to learn Angular and ASP.NET. Design based on the Samsung Notes app.

## This project uses:
* Angular 16;
* ASP.NET;
* PostgreSQL 16.

## Setup
* Setup the Database:
  * Rename `appsettingsexample.json` to `appsettings.json`;
  * Replace `yourpassword` with the password for your postgres user;
  * You can also change the server, port, user or database if needed;  
* Run `dotnet ef database update` to create and setup the database for the project.
* Setup the Angular App:
  * Open a command promt in the `angularapp` folder;
  * Run `npm install` to setup the project;
  * Run `npm start` to build and serve the app.
* Build and run the `webapi` project from the `NotesApp` solution.
  * You can also change the solution settings to build both projects at the same time.
