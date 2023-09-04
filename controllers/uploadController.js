const csv = require("csv-parser");
const fs = require("fs");
// const { connectDB } = require("../config/db");
const { MongoClient } = require("mongodb");
const Bank = require("../model/BankSchema"); 

const mongoURI =
  "mongodb+srv://excellence-pardeep:excellence-pardeep@cluster0.mfk2efk.mongodb.net/";
const dbName = "CSV_Upload";
const client = new MongoClient(mongoURI);
client.connect(); // Connect to MongoDB server

const db = client.db(dbName);
const collection = db.collection("commondata");

const uploadCSVFiles = async (req, res) => {
  try {
    // connectDB();
    // console.log(connectDB.collection);
   

    for (const file of req.files) {
      const results = [];

      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (data) => {
          let type="";
          let transaction_amount;
          let result ={};
          if (req.body.BankName === "HDFC") {
            // if (data["Debit Amount"] !== "0" && data["Credit Amount"] === "0") {
            //   type = "DR";
            //   transaction_amount = data["Debit Amount"];
            // } else if (
            //   data["Debit Amount"] === "0" &&
            //   data["Credit Amount"] !== "0"
            // ) {
            //   type = "CR";
            //   transaction_amount = data["Credit Amount"];
            // }
            const debitAmount = parseFloat(data["Debit Amount"]);
const creditAmount = parseFloat(data["Credit Amount"]);
const type = debitAmount !== 0
  ? "DR"
  : creditAmount !== 0
  ? "CR"
  : "";
const transaction_amount = type === "DR" ? debitAmount : creditAmount;
            result.date = data["Date"];
            result.description = data["Narration"];
            result.type = type;
            result.transaction_amount = transaction_amount;
            result.cheque_no = data["Chq/Ref Number"];
            result.total_balance = data["Closing Balance"];
            result.transaction_id = null;
            result.txn_posted_date=null;
          } else if (req.body.BankName === "ICICI") {
            result.date = data["Value Date"];
            result.description = data["Description"];
            result.type = data["Cr/Dr"];
            result.transaction_amount = data["Transaction Amount(INR)"];
            result.cheque_no = data["ChequeNo."];
            result.total_balance = data["Available Balance(INR)"];
            result.transaction_id = data['Transaction ID']
            result.txn_posted_date = data['Txn Posted Date']
          }
          result.bank_name = req.body.BankName;
          result.account_number = req.body.AccountNumber;

          results.push(result);
        
        })
        .on("end", async () => {
          try {
            await collection.insertMany(results);
            fs.unlinkSync(file.path);
          } catch (insertError) {
            console.error("Error inserting data:", insertError);
          }
        });
    }

    res.status(200).json({ message: "CSV files uploaded and data saved." });
  } catch (connectionError) {
    console.error("Error connecting to MongoDB:", connectionError);
    res.status(400).json({
      message: "Error uploading CSV files.",
      error: connectionError.message,
    });
  }
};

const login = (req, res) => {
  const hardcodedUsername = "pardeep";
  const hardcodedPassword = "12345";

  const { name, pass } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Username not found", code: "Please fill username" });
  }

  if (!pass) {
    return res
      .status(400)
      .json({ message: "Password not found", code: "Please fill password" });
  }

  if (name === hardcodedUsername && pass === hardcodedPassword) {
    return res
      .status(200)
      .json({ message: "Login Successfully", code: "success" });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Username and Password", code: "Fail" });
  }
};

const getAll = async (req, res) => {
  const data = await collection.find({}).toArray();
  console.log(data);
  res.status(200).json({
    message: "fetch data successfully",
    success: true,
    data: data,
  });
};
module.exports = { login, uploadCSVFiles, getAll };
