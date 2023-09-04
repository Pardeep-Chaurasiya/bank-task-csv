const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.use("/uploads", express.static(__dirname + "/public/uploads"));

app.use("/api", uploadRoutes);

// const mongoURI = "mongodb://127.0.0.1:27017/CSV_Upload_II";

// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB Connected');
//     app.listen(7777, () => {
//       console.log("App is running on port 7777");
//     });
//   })
//   .catch((error) => {
//     console.error("Error connecting to the database:", error);
//   });

app.listen(8080, () => {
  console.log("App is running on port 8080");
});
