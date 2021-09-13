
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });

    user.save((err, user) => {
        if(err){
            res.status(500).sned({message: err});
            return;
        }

        if(req.body.roles){
            Role.find(
                {
                  name: { $in: req.body.roles}
                },
            (err, roles) => {
                if(err){
                    res.status(500).send({message: err});
                    return;
                }

                user.roles = roles.map(role => role._id);
                user.save(err => {
                    if(err){
                        res.status(500).send({message: err});
                        return;
                    }

                    res.send({message: "User was registered successfully"});
                });
            }
        );

        }else {
            Role.findOne({name: "User"}, (err, user) => {
                if(err){
                    res.status(500).send({message: err});
                    return;
                }
                
                user.roles = [roles._id];
                user.save(err => {
                    if(err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    res.send({message: " User was registered successfully"});
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
       .populate("roles", "-__v")
       .exec((err, user) => {
           if(err){
               res.status(500).send({mesage: err});
               return;
           }
           if(!user){
               return res.status(404).send({message: "User not found"});
           }

           var passwordValid = bcrypt.compareSync(
               req.body.password,
               user.password
           );

           if(!passwordValid){
               return res.status(401).send({
                   accessToken: null,
                   message: "Invalid password"
               });
           }

           var token = jwt.sign({ id: user.id }, config.secret, {
               expiresIn: 86400
           });

           var authorities = [];

           for(let i = 0; i< user.roles.length; i++){
               authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
           }
           res.status(200).send({
               id: user._id,
               username: user.username,
               email: user.email,
               roles: authorities,
               accessToken: token
           });
       });
};