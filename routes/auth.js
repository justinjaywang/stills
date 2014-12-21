var express = require('express');
var router = express.Router();

var Dropbox = require('dropbox');
var dropboxAppKey = 'c2vu235ninfa2dr';
var dropboxAppSecret = 'xutedulpf3wahdw';

// authenticate
// var authenticate = function() {
  // initialize Dropbox client
  var dbClient = new Dropbox.Client({
    key: dropboxAppKey,
    secret: dropboxAppSecret,
    sandbox: true
  });
  console.log(dbClient);
  dbClient.authDriver(new Dropbox.AuthDriver.NodeServer(8192));
  // dbClient.authDriver(new Dropbox.AuthDriver.Redirect({
  //   rememberUser: true
  // }));
  dbClient.authenticate(function(error, client) {
    if (error) {
      return showError(error);
    }
    if (false) { // TO DO: check for if is authenticated
      doSomething(client);
    } else {
      // show and set up the "Sign into Dropbox" button
      // var buttonElement = document.getElementById('authorize');
      // buttonElement.setAttribute('class', 'visible');
      // buttonElement.addEventListener('click', function() {
      //   // The user will have to click an 'Authorize' button.
      //   dbClient.authenticate(function(error, client) {
      //     if (error) {
      //       return handleError(error);
      //     }
      //     doSomething();
      //   });
      // });
      doSomething(client);
      console.log('authenticate');
    }
  });
// };

// do something, TEMP
var doSomething = function(client) {
  console.log('doSomething');
  // console.log(client);
  console.log('token ', client._oauth._token); // token; TO DO: save this

  client.getAccountInfo(function(error, accountInfo) {
    if (error) {
      return showError(error);
    }
    // console.log(accountInfo);
    console.log('Hello, ' + accountInfo.name + '!');
  });

  client.readdir("/", function(error, entries) {
    if (error) {
      return showError(error);  // Something went wrong.
    }

    console.log(entries);

    console.log('Your Dropbox contains ' + entries.join(', '));
  });

};

// error handling
var showError = function(error) {
  switch (error.status) {
    case Dropbox.ApiError.INVALID_TOKEN:
      // If you're using dropbox.js, the only cause behind this error is that
      // the user token expired.
      // Get the user through the authentication flow again.
      break;

    case Dropbox.ApiError.NOT_FOUND:
      // The file or folder you tried to access is not in the user's Dropbox.
      // Handling this error is specific to your application.
      break;

    case Dropbox.ApiError.OVER_QUOTA:
      // The user is over their Dropbox quota.
      // Tell them their Dropbox is full. Refreshing the page won't help.
      break;

    case Dropbox.ApiError.RATE_LIMITED:
      // Too many API requests. Tell the user to try again later.
      // Long-term, optimize your code to use fewer API calls.
      break;

    case Dropbox.ApiError.NETWORK_ERROR:
      // An error occurred at the XMLHttpRequest layer.
      // Most likely, the user's network connection is down.
      // API calls will not succeed until the user gets back online.
      break;

    case Dropbox.ApiError.INVALID_PARAM:
    case Dropbox.ApiError.OAUTH_ERROR:
    case Dropbox.ApiError.INVALID_METHOD:
    default:
      // Caused by a bug in dropbox.js, in your application, or in Dropbox.
      // Tell the user an error occurred, ask them to refresh the page.
  }
};

/* GET authorization token. */
router.get('/', function(req, res) {
  // res.send('respond with a resource');
  res.render('index', { title: 'Authorize' });
  authenticate();
});

module.exports = router;
