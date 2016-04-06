"use strict";
///<reference path="typings/tsd.d.ts"/>
/*schemas with model defining page export model from other files index.ts & mobile.ts*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var express = require("express");
var app = express();
/* mongoose schema*/
var userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: { type: String, unique: true, index: true },
    password: String,
    uid: String,
    companyMongoId: [String],
    _creator: { type: Schema.Types.ObjectId, ref: 'company' }
});
/*   schema model*/
var userModel = mongoose.model("users", userSchema);
exports.userModel = userModel;
/* company schema*/
var companySchema = Schema({
    companyName: String,
    companyAddress: String,
    companyPhone: Number,
    firebaseUid: String,
    getSignUp: { type: Schema.Types.ObjectId, ref: 'users' } /*admin signUp mongo _id*/,
    salemanOrderList: [String],
    salemanMongoId: [String]
});
/* company schema*/
/* company model*/
var company = mongoose.model('company', companySchema);
exports.company = company;
/* mongoose schema*/
var salesmanSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true, index: true },
    Password: String,
    MobileNumber: Number,
    NICNumber: Number,
    Comments: String,
    adminSignUpMongoUid: String,
    uid: String,
    orderList: [String]
});
/*   schema model*/
var salesman = mongoose.model("salemanUsers", salesmanSchema);
exports.salesman = salesman;
/* mongoose orderSchema*/
var orderSchema = new mongoose.Schema({
    orderTitle: String,
    orderText: String,
    salemanMongoIds: String
});
var salemanOrder = mongoose.model("salemanOrder", orderSchema);
exports.salemanOrder = salemanOrder;
//# sourceMappingURL=schemas.js.map