const csv = require("csv-parser");
const fs = require("fs");

const Statement = require("../model/statement");

const uploadStatement = async (req, res) => {
  try {
    for (const file of req.files) {
      const results = [];
      let bankName = req.body.bankName;
      // bankName.toUpperCase()

      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (data) => {
          let result = {};
          if (bankName === "HDFC") {
            const debitAmount = parseFloat(data["Debit Amount"]);
            const creditAmount = parseFloat(data["Credit Amount"]);
            const type =
              debitAmount !== 0 ? "DR" : creditAmount !== 0 ? "CR" : "";
            const transaction_amount =
              type === "DR" ? debitAmount : creditAmount;
            let formatDate = data["Date"];
            let newFormatDate = formatDate.split("/").join("-");
            result.date = newFormatDate;
            result.description = data["Narration"];
            result.type = type;
            result.transaction_amount = transaction_amount;
            result.cheque_no = data["Chq/Ref Number"];
            result.total_balance = data["Closing Balance"];
            result.transaction_id = null;
            result.txn_posted_date = null;
          } else if (bankName === "ICICI") {
            dateFormat = data["Value Date"];
            dateFormat = dateFormat.split("-");
            let year = dateFormat[2].split("");
            let yea = year[2] + year[3];
            let newDate = dateFormat[1] + "-" + dateFormat[0] + "-" + yea;
            result.date = newDate;
            result.description = data["Description"];
            result.type = data["Cr/Dr"];
            result.transaction_amount = data["Transaction Amount(INR)"];
            result.cheque_no = data["ChequeNo."];
            result.total_balance = data["Available Balance(INR)"];
            result.transaction_id = data["Transaction ID"];
            result.txn_posted_date = data["Txn Posted Date"];
          }
          result.bank_name = bankName;
          result.account_number = req.body.AccountNumber;

          results.push(result);
        })
        .on("end", async () => {
          try {
            await Statement.insertMany(results);
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

const getAll = async (req, res) => {
  const data = await Statement.find({});
  console.log(data);
  res.status(200).json({
    message: "fetch data successfully",
    success: true,
    data: data,
  });
};

const getStatement = async (req, res) => {
  try {
    // const { page } = req.query || 1;
    // const { perPage } = req.query || 10;
    const accountno = req.params.accountno;

    // const startIndex = (page - 1) * perPage;
    const getStatement = await Statement.find({ account_number: accountno });
    // console.log(getStatement3);
    // .limit(perPage);
    if (!getStatement) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.status(200).json({
      data: getStatement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const searchdate = async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const result = await Statement.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  if (result) {
    res.status(200).json({ message: "filter date applied", result });
    return;
  }
  res.status(400).json({ message: "No data found" });
};

module.exports = { uploadStatement, getAll, getStatement, searchdate };
