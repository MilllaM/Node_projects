module.exports = function(sessionStorage, users, role) {
  return function(req, res, next) {
    if (req.isAllowed) {
      next();
    }
    else {
      let name = sessionStorage.getUser(req.sessionID);
      req.isAllowed = req.session && users.isAccepted(name, role);
      next();
    }
  };
};
