# mern-backend

## preparation

Setting up connection to remote repository
```git
    git remote add origin https://github.com/lineralpha/mern-backend.git
    git branch --set-upstream-to origin/main
    git pull origin --allow-unrelated-histories 
```

## middleware tools

### morgan
Morgan is an HTTP request logger middleware that generates logs for each API request.

### helmet
Helmet is a collection of several small middleware tools that, working together protect your app from well-known vulnerabilities and attacks.

### cors
CORS stands for Cross-Origin Resource Sharing. It is used to enable and configure CORS in express.js apps.

By default, express.js enables same-origin policy thus rejects request from React frontend.

### express-rate-limit
As its name suggests, express-rate-limit is a basic rate-limiting middleware that limits the repeated API requests from the same IP address.

## other JavaScript libraries

### joi
Joi is a schema description and validation tool for JavaScript. It can be used to validate if a login password conforms with a predefined schema.

### lodash
Lodash is a javaScript library providing functions to like map, filter, etc.
