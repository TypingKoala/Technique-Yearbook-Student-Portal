# Technique Yearbook Student Portal
Technique is the official student-run yearbook of the Massachusetts Institute of Technology. Each year, a group of talented students turn over 400 blank pages into a time-honored publication that will be kept in bookshelves for decades to come.

The student portal allows for yearbook organizations such as Technique to manage the student information workflow from biographical information importing, editing, and confirmation. 

# Table of Contents

- [Technique Yearbook Student Portal](#technique-yearbook-student-portal)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Running](#running)
- [Standalone File](#standalone-file)
- [APIs](#apis)
- [Built With](#built-with)
- [License](#license)

# Getting Started
## Prerequisites
The only prerequisite is Node.js and npm (which is included with Node.js). All other packages are installed through npm.

## Installing
Let's first clone the git repo :
```
$ git clone https://github.com/TypingKoala/Technique-Yearbook-Student-Portal.git
```

Now, change into the new folder:
```
$ cd Technique-Yearbook-Student-Portal/
```

Install the dependencies using npm:
```
$ npm install
```
 ## Config
There are two environment variables that need to be set in order for the application to properly function: `tnqportalkey` and `NODE_ENV`.

* `tnqportalkey` is used to encrypt and decrypt the keys used in `config/secrets.enc.json` in order for secrets to be safely committed to a git repository.
* `NODE_ENV` will determine whether the database at `MongoDev` or `MongoProd` is used. This is helpful when you want to have two different databses for development and production. Specifically, if `NODE_ENV=production`, `MongoProd` will be used, otherwise `MongoDev` will be used.

If you are adapting this application to your own use case, you will have to generate your own `tnqportalkey` and encrypt your own secrets using that key. You can easily achieve this using the `standalone` file, described below.

In addition, you will need to change the JSON in `config/settings.json` in order to configure your base URL. For example, if end users can access the server at `tnqportal.mit.edu`, then the FQDN (fully-qualified domain name) should be that. 

You can also configure it to run on a port other than port `80` by using the PORT attribute in `config/settings.json`.

## Running
You can run the web application using
```
$ node index.js 
```
It is best to run using [forever](https://github.com/foreverjs/forever) or [pm2](https://github.com/Unitech/pm2) in order to run the process in the background and automatically restart if it crashes.

# Standalone File
The standalone file allows adminstrators to configure the deployment from the command line. The functionality is described here and also in the help utility using 
```
$ node standalone --help
```
```
Usage: standalone [options] [command]

Options:
  -V, --version     output the version number
  -h, --help        output usage information

Commands:
  encrypt <string>  Encrypt the given string using the environment variable tnqportalkey
  decrypt <string>  Decrypt the given string using the environment variable tnqportalkey
  import <path>     Import students from a csv file at the given path
  email [options]   Send emails to students who have not confirmed
```

# APIs
For full-functionality, this web app uses APIs such as MIT OpenID Connect and Mailgun. API keys are stored in `config/secrets.enc.json` and are encrypted by Cryptr. 

# Built With
* [Express.js framework](https://expressjs.com/)
* [Node.js](https://nodejs.org)
* [MongoDB](https://www.mongodb.com/)



# License
[MIT License](LICENSE.md)