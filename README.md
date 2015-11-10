# SigWel

Signature Validator App

## Purpose Statement
 - Make a tool that validates signatures of a user by tracking the pattern of the signatures.

## Demo
The demo app is hosted on [Heroku](https://sigwel.herokuapp.com), welcome to have a try!

## Collaborating&Collaborators
The project is being organized on [Trello](https://trello.com/b/jikk5lqR/sigwel), discussion happens on [Slack](https://nodejshouston.slack.com/messages/code-sigwel/), and documentation are defined in the README files.

###Collaborators:
- Jeffry Tupa  (Give the idea of the project and develop frond-end part)
- Keith Stewart  (Organize code based on hapi-ninja Boilerplate, which built by Saul, thanks)
- Zhaoxin Sun  (Do back-end part, mainly on api and validation algorithm)
- Sid Pareek  (Give lots of idea on requiments of the project)
- Ilmo Jung  (Focus on security of the project)
- Saul Maddox , Alan Lee  (Always help us out when we have technical quesions)


## Project outline
- Sandbox folder for prototyping
- Database (MongoDB instance)
- Server framework (hapi.js)
- Client framework (Foundation)
- Documentation
- Hosting (Heroku for now)
- Client side scaffolding (react, angular, ember)

## Before running the Server
[NodeJS](https://nodejs.org/) must installed.
Install [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) globally: npm install --global gulp

## Running the Server
To run the server and follow the steps below:
1. Run `npm install` from the command prompt to install any dependencies that you have not already installed
2. Run `gulp serve-dev` to run the server and watch for and restart the server after any changes to server files
3. Open browser and navigate to http://localhost:3000/

## Running the client example
### react example
1. move to `public/client_example/react`, run `npm install` from the command prompt to install all dependencies
2. Run `npm run dev` to launch webpack-server which serve react example locally.
3. Open browser and navigate to http://localhost:8080/


## Folder Structure
### Public folder
 - The "public" folder for front-end (client side) code (including different frontend framework example).

### Server folder
- The "server" folder for server side code.
### main file and dev configuration
- server.js (main file)
- package.json (package management)
- gulpfile.js (build management)

