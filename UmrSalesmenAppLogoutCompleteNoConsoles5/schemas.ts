///<reference path="typings/tsd.d.ts"/>
/*schemas with model defining page export model from other files index.ts & mobile.ts*/
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let express = require("express");

var app = express();

/* mongoose schema*/
let userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: {type: String, unique: true, index: true},
    password: String,
    uid: String,
    companyMongoId:[String],
    _creator: {type: Schema.Types.ObjectId, ref: 'company'}
});
/*   schema model*/
let userModel = mongoose.model("users", userSchema);


/* company schema*/
let companySchema = Schema({
    companyName: String,
    companyAddress: String,
    companyPhone: Number,
    firebaseUid: String,//{type: Schema.Types.ObjectId, ref: 'users'},
    getSignUp: {type: Schema.Types.ObjectId, ref: 'users'}/*admin signUp mongo _id*/,
    salemanOrderList:[String],
    salemanMongoId :[String]
});
/* company schema*/

/* company model*/
var company = mongoose.model('company', companySchema);


/* mongoose schema*/
let salesmanSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: {type: String, unique: true, index: true},
    Password: String,
    MobileNumber: Number,
    NICNumber: Number,
    Comments: String,
    adminSignUpMongoUid: String,
    uid: String,
    orderList : [String]
    
});
/*   schema model*/
let salesman = mongoose.model("salemanUsers", salesmanSchema);

/* mongoose orderSchema*/
let orderSchema = new mongoose.Schema({
    orderTitle: String,
    orderText: String,
    salemanMongoIds: String
});
let salemanOrder = mongoose.model("salemanOrder", orderSchema)


export {userModel, company, salesman, salemanOrder};
