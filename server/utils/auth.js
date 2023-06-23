const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

function getTokenOffOfReq(req) {
  // allows token to be sent via  req.query or headers
  let token = req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  return token;
}

function checkToken(token) {
  try {
    // verify token and get user data out of it
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return data;
  } catch (err) {
    return null;
  }
}
  
  module.exports = {
    // function for our authenticated routes
    authMiddleware: function (req, res, next) {
      const token = getTokenOffOfReq(req);
      
      if (!token) {
        return res.status(400).json({ message: 'You have no token!' });
      }
      
      const user = checkToken(token);

      if (!user) {
        console.log('Invalid token');
        return res.status(400).json({ message: 'invalid token!' });
      }

      req.user = user;
    
      // send to next endpoint
      next();
  },
  graphQLAuthMiddleware: function ({ req }) {
    return { token: getTokenOffOfReq(req) }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  checkToken,
};
