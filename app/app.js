const express = require("express");
const bodyParser = require("body-parser");
const connect_db = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
app.use("/", authRouter);

app.listen(3000, () => {
  console.log("Running the server");
  connect_db();
});
