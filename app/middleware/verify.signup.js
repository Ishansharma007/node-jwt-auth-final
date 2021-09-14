const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, foundUser) => {   //Mongoose will not execute a query until then or exec has been called upon it
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (foundUser) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, foundUser) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (foundUser) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();

    });

  });

};

checkRolesExisted = (req, res, next) => {
    let newRole = req.body.roles ;
    if(newRole) {
        for ( let i = 0; i < newRole.length; i++) {
            if(!ROLES.includes(newRole[i])) {
                res.status(400).send({
                    message: `Failed! Role ${newRole[i]} does not exist! `
                });
            return;
            }
        }
    }

    next();
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;


