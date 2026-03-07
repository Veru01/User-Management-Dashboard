require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./db/conn");
const router = require("./Routes/router");

const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors());
app.use(router);

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => {
    console.log("Server starts at port no: " + port);
  });
});
