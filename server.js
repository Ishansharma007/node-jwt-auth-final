//jshint esversion:6

const express = require("express");
const cors = require("cors");

const app = express();


var corsOptions = {
    origin : "https://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

const db = require("./app/models");
const Role = db.role;

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const dbConfig = require("./app/config/db.config");

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,  
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Succesfully connected to mongoDB.");
        initial();
    })
    .catch(err => {
        console.error("connection error", err);
        process.exit();
    });

//inital() helps us create 2 rows in roles collection    

function initial(){
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0){
            new Role({
                name: "user"
            }).save(err => {
                if(err){
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if(err){
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}



app.get("/", (req, res) => {
    res.send("welcome boi !");
});

let PORT = 3000 ;

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT} .`);
});