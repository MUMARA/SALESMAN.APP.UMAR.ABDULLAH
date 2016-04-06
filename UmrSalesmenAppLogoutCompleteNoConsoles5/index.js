"use strict";
///<reference path="typings/tsd.d.ts"/>
var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var Firebase = require("firebase");
var mongoose = require('mongoose');
var cors = require('cors');
var mobileRoutes = require("./mobile");
var app = express();
app.use(cors());
/*import schemas*/
var schemas_1 = require("./schemas");
var schemas_2 = require("./schemas");
mongoose.connect('mongodb://umar:mumar.5gbfree.com@ds015398.mlab.com:15398/umar');
var ref = new Firebase("https://umrsalesman.firebaseio.com");
app.use(bodyParser.json());
app.use(function (req, res, next) {
    //  console.log("uid:",req.query.uid , "token:", req.query.token );
    next();
});
app.use("/mobo", mobileRoutes);
app.post("/signUp", function (req, res) {
    /*firebase coding https://www.firebase.com/docs/web/api/firebase/createuser.html*/
    ref.createUser({
        email: req.body.email,
        password: req.body.password
    }, function (error, userData) {
        if (error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
            }
        }
        else {
            //   console.log("Successfully created user account with uid:", userData.uid);
            /*include data in schema  */
            var newuser = new schemas_1.userModel({
                fname: req.body.firstName,
                lname: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                uid: userData.uid,
                companyMongoId: 'notAvailableDueToSlowInternet'
            });
            newuser.save(function (err, data) {
                if (err) {
                    console.log("error Recived from sign up", err);
                }
                else {
                    //    console.log("Data Successfully Send to data Base", data, " & data._id is ", data._id);
                    res.json({ success: true, "msg": "data Send Successfully", data: data._id });
                }
            });
        }
    });
});
app.post("/signIn", function (req, res) {
    //console.log(req.body.email, req.body.password);
    ref.authWithPassword({
        "email": req.body.email,
        "password": req.body.password
    }, function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            res.status(401);
            res.send("signin failed");
        }
        else {
            console.log("admin signIn Authenticated successfully index.ts :", authData.uid);
            var adminSignInFirebaseId = authData.uid;
            //res.send("this is authData", authData);
            schemas_1.userModel.findOne({ uid: authData.uid }, function (err, record) {
                if (err) {
                    console.log("Error in finding User", err);
                }
                else {
                    res.json({
                        success: true, "msg": "data Recieved", record: record, adminSignInFirebaseId: authData.uid
                    });
                }
            });
        }
    });
});
var publicPath = path.resolve(__dirname, "salesmenAppUmar/www");
app.use(express.static(publicPath));
app.listen(3000, function () {
    console.log("running 3000");
});
app.post("/registerCompany", function (req, res) {
    // console.log(req.body);    //
    // userModel.findOne({uid:'0ccad774-cfbc-401f-a052-e42d62681fa8'},(err,data)=>{
    //    if(!err){
    //        console.log("index.ts userModel.findOne user data is ",data," & userModel IS ",userModel.fname)    
    //    }
    //    });
    schemas_1.userModel.findOne({ uid: req.body.firebaseUid }, function (err, data) {
        if (!err) {
            var newCompany = new schemas_2.company({
                companyName: req.body.companyName,
                companyAddress: req.body.companyAddress,
                companyPhone: req.body.companyPhone,
                firebaseUid: req.body.firebaseUid,
                getSignUp: data._id /*admin signUp mongo _id*/,
                salemanOrderList: ['notAvailableDueToSlowInternetConnection'],
                salemanMongoId: ['notAvailableDueToSlowInternet']
            });
            newCompany.save(function (err, adminSave) {
                {
                    if (err) {
                        console.log("error Recived from index.ts /registerCompany adminData", err);
                        res.json({ success: false, "msg": "Error Recived", err: err });
                    }
                    else {
                        //console.log(' don.companyMongoId = data._id ;', adminSave._id);
                        schemas_1.userModel.findOne({ companyMongoId: 'notAvailableDueToSlowInternet' }, function (err, don) {
                            don.companyMongoId.push(adminSave._id);
                            don.save();
                            // console.log('doc is ', don);
                        });
                    }
                }
            }).then(function () {
                return schemas_2.company
                    .findOne({ companyName: req.body.companyName })
                    .populate('getSignUp')
                    .exec(function (err, company) {
                    if (err) {
                        console.log('err in population', err);
                    }
                    else {
                        //     console.log('The company is ', company);
                        res.json(company);
                    }
                });
            });
        }
        else {
            console.log("error findone");
        }
    });
});
app.get('/populate', function (req, res) {
    schemas_1.userModel
        .findOne({ companyMongoId: 'notAvailableDueToSlowInternet' })
        .populate('_creator')
        .exec(function (err, data) {
        if (err) {
            console.log('error in admin signIn population ', err);
        }
        else {
            console.log('The population creator is ', data);
        }
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
    // process.exit(1);
});
mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});
process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events/////////////////////////////////////////////// 
//# sourceMappingURL=index.js.map