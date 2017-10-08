import Promise from 'bluebird';
import passport from 'passport';

/*
  - Main Function that uses below functions to authenticate the user
  - Returns a response that tells the Frontend where to redirectTo via browserHistory
*/
export default async function(type, req, res, next){
  try {;
    const user = await authenticate(type, req, res, next);
    const response = await login(user, req, res, next);
    res.status(200).send(response);
  }
  catch(err) {
    res.status(400).send({
      error: err.message,
    });
  }
}

/*
  - Authenticates via Passport at specified strategy by @param type
  - Returns a Promise that if resolved, returns the user
*/
function authenticate(type, req, res, next) {
  return new Promise(function(resolve, reject){
    // Use passport to authenticate
    passport.authenticate(type, function(err, user, info){
      if(err) {
        reject(new Error(err.message));
      }
      else if(!user) {
        reject(new Error(info.message));
      }
      else {
        resolve(user);
      }
    })(req, res, next);
  });
}

/*
  - Attempts to Login given the @param user
  - Returns a Promise that will be used for the HTTP Response
*/
function login(user, req, res, next) {
  return new Promise(function(resolve, reject){
    // Attempt to login with given user
    req.logIn(user, function(err){
      if(!err) {
        resolve({
          user: user,
          redirectTo: user.name ? '/menu' : '/restaurant/create',
        });
      }
      else {
        reject(err.message);
      }
    });
  });
}
