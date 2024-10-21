const mongoose = require("mongoose");
const { MONGO_USERNAME, MONGO_PASSWORD } = require("./config");

const connect_db = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.j05ui.mongodb.net/convinai?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("DB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
};

module.exports = connect_db;
