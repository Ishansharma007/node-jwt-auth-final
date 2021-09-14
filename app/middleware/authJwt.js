

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role ;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({ message: "No token provided"});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({ message: "Unauthorized ! "});
        }
        res.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, foundUser) => {
        if(err){
            res.status(500).send({ message: err});
            return;
        }

        Role.find(
            {
                _id: { $in: User.roles } //The $in operator takes an array as its value. And $in operator, 
                                         //in turn, is assigned to the field according to which the filtration is to be done
            },
            (err, roles) => {
                if(err){
                    res.status(500).send({message : err});
                    return;
                }

                for(let i = 0; i< roles.length; i++){
                    if(roles[i].name === "admin") {
                        next();
                        return;
                    }
                }
                
                res.status(403).send({message: "Require Admin role! "});
                return;
            }

        );
    });
};



const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;