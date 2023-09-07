const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const connection = require("./config/db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/uploads", express.static(__dirname + "/public/uploads"));
app.use("/api", uploadRoutes);
const PORT = 8080;
app.listen(PORT, () => {
  connection();
  console.log("App is running on port " + PORT);
});
