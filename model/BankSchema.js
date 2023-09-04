const mongoose = require("mongoose");

const BankSchemas = new mongoose.Schema({
    date:{
        type:String
    },
    description:{
        type:String
    },
    type:{
        type:String
    },
    transaction_amount:{
        type:String
    },
    cheque_no:{
        type:String
    },
    total_balance:{
        type:String
    },
    transaction_id:{
        type:String
    },
    txn_posted_date:{
        type:String
    },
    bank_name:{
        type:String
    },
    account_number:{
        type:String
    }
})

const Bank = mongoose.model("BankSchema",BankSchemas)
module.exports = Bank;