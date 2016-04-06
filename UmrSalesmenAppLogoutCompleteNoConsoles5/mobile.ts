///<reference path="typings/tsd.d.ts"/>

import express = require("express");
import http = require("http");
import path = require("path");
var mongoose = require('mongoose');
var Firebase = require("firebase");
var bodyParser = require("body-parser");

let api = express.Router();

import {userModel} from "./schemas";
import {company} from "./schemas";
import {salesman} from "./schemas";
import {salemanOrder} from "./schemas";

//mongoose.connect('mongodb://umar:mumar.5gbfree.com@ds015398.mlab.com:15398/umar');
var ref = new Firebase("https://umrsalesman.firebaseio.com");


api.post("/salesmanSignup", function (req, res) {

    console.log(req.body);
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
        } else {
            //    console.log("Successfully created user account with uid:", userData.uid);


            /*include data in schema  */
            var salemanSignUpSchema:any = new salesman({
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                Email: req.body.email,
                Password: req.body.password,
                MobileNumber: req.body.mobileNumber,
                NICNumber: req.body.nicNumber,
                Comments: req.body.comments,
                adminSignUpMongoUid: req.body.id,
                uid: userData.uid

            });
            salemanSignUpSchema.save(function (err, data) {
                if (err) {
                    console.log("error Recived from salemanSignUpSchema", err);
                    //  res.json({success: false, "msg": "Error Recived", err: err})
                }
                else {//console.log("Data of salemanSignUpSchema Successfully Send to data Base", data, " & data._id is ", data._id);
                    //console.log(' salesman.findOne() is',salesman.findOne({}));

                    res.json({success: true, "msg": "data of salemanSignUpSchema Send Successfully", data: data._id})
                    // res.send(salesman.findOne({}));

                    company.findOne({salemanMongoId: 'notAvailableDueToSlowInternet'}, function (err, derr) {
                        derr.salemanMongoId = data._id;
                        derr.save();
                        //console.log('doc is ',derr);
                    });
                }
            });
        }
    });
});

/*api.get('/getAllData', function (req, res) {
 salesman.find({}, function (err, data) {

 if (!err) {
 console.log('get console salemanusers from mongo lab in index.ts is', data);
 /!*   res.json({
 data: data
 });
 *!/
 } else {
 console.log('get err console salemanusers from mongo lab in index.ts is', err);
 }

 });
 userModel.find({}, function (err, data) {

 if (!err) {
 //  console.log('get console users from mongo lab in index.ts is', data);
 /!*   res.json({
 data: data
 });*!/

 } else {
 console.log('get err console users from mongo lab in index.ts is', err);
 }

 });
 company.find({}, function (err, data) {

 if (!err) {
 console.log('get console companies from mongo lab in index.ts is', data);
 /!*          res.json({
 data: data
 });*!/

 } else {
 console.log('get err console companies from mongo lab in index.ts is', err);
 res.send('company');
 }

 });
 })*/

api.post("/signIn", function (req, res) {

    //  console.log('mobile.ts saleman signIn',req.body.email, req.body.password);

    ref.authWithPassword({
        "email": req.body.email,
        "password": req.body.password
    }, function (error, authData) {
        if (error) {
            console.log("Login Failed! of mobile.ts signIn ", error);
            res.status(401);
            res.send("of mobile.ts signIn signin failed");
        } else {
            //  console.log("Authenticated successfully with payload:", authData);
            //res.send("this is authData", authData);
            /*    userModel.findOne({uid: authData.uid}, function (err, record) {
             if (err) {
             console.log("Error in finding User", err);

             } else {
             res.json({
             success: true, "msg": "data Recieved", record: record
             // uid: req.body.uid
             });
             //   console.log("sucessfully user model & record is ", record);
             }
             }).then(function () {
             //userModel.findOne({id :_id})
             res.send({status : false , message : "user Does not exist!"});
             })*/
            //console.log('  mobile.ts signIn successfull authdata is ',authData);


            salesman.findOne({uid: authData.uid}, function (err, data) {
                if (err) {
                    console.log("Error in finding User", err);

                } else {
                    //  console.log("sucessfully firebase salemanUid is ", data.id);
                    res.json({
                        success: true, "msg": "data Recieved", record: data.id
                        // uid: req.body.uid

                    });

                }
            })
        }
    });
});

////////////  dashboard route //////////////////////


api.post('/dashboard', function (req, res) {

    console.log(req.body);

    /*include data in schema  */
    var salemanOrderMongo = new salemanOrder({
        orderTitle: req.body.orderTitle,
        orderText: req.body.orderText,
        salemanMongoIds: req.body.salemanMongoId
    });
    salemanOrderMongo.save(function (err, data) {
        if (err) {
            console.log("error Recived from salemanOrderMongo", err);
            //  res.json({success: false, "msg": "Error Recived", err: err})
        }
        else {
           // console.log("Data of salemanOrderMongo Successfully Send to data Base", data,' data._id ',data._id);
            //  console.log('salesman.findOne({ _id: req.body.salemanMongoId }) is  ',salesman.findOne({ _id: req.body.salemanMongoId }))
console.log(' req.body.salemanMongoId in mobile.ts is ',req.body.salemanMongoId,' & data._id is ',data._id);
            
            salesman.findOne({_id: req.body.salemanMongoId}, function (err, doc) {
                doc.orderList.push(data._id);
                doc.save();
            });
        }
    });
});

////////////  end  dashboard route //////////////////////

module.exports = api;
