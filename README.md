# datim-user-management-ng
React based user management for PEPFAR/DATIM

================

# Building

## Prerequisites
Make sure you have at least the following versions of `node`, `npm` and `yarn`:

```sh
$ node -v
v8.10.0
```
```
$ npm -v
5.6.0
```
```
$ yarn -v
1.5.1
```

## Getting started

Clone the repository from github with the following command
```bash
git clone git@bitbucket.org:Awnage/datim-user-management-ng.git
```

Install the node dependencies
```bash
yarn
```

To set up your DHIS2 instance to work with the development service you will need to add the development servers address to the CORS whitelist. You can do this within the DHIS2 Settings app under the _access_ tab. On the access tab add `http://localhost:8081` to the CORS Whitelist.
> The starter app will look for a DHIS 2 development instance configuration in
> `$DHIS2_HOME/config`. So for example if your `DHIS2_HOME` environment variable is
> set to `~/.dhis2`, the starter app will look for `~/.dhis2/config.js` and then
> `~/.dhis2/config.json` and load the first one it can find.
>
> The config should export an object with the properties `baseUrl` and
> `authorization`, where authorization is the base64 encoding of your username and
> password. You can obtain this value by opening the console in your browser and
> typing `btoa('user:pass')`.
>
> If no config is found, the default `baseUrl` is `http://localhost:8080/dhis` and
> the default username and password is `admin` and `district`, respectively.
>
> See `webpack.config.js` for details and `config.json.example` for an example.

This should enable you to run the following node commands:

To run the development server
```bash
npm start
```

or

```bash
DHIS2_HOME=./ && npm start
```

# Testing

To run the tests including coverage
```sh
npm test
```

To run the tests continuously on file changes (for your BDD workflow)
```sh
npm run test-watch
```

# Distributing

To make a DHIS2 app zip file, run:
```sh
npm run-script dist
```
- Rename the file `build/user-management.zip` with versioning, e.g. `user-management_29_0_1.zip`
- Then load the zip file to your DHIS2 instance.

# Contributing

```bash
git checkout master
git pull origin master
git branch my-branch
git checkout my-branch
<do your changes>
npm test
git add <your files>
git commit -m "descriptive and atomic commit message"
git push origin my-branch
git checkout master
git merge my-branch
```
