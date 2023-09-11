const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64fee5e50debeb15e9469874")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

mongoose
  .connect(
    "mongodb+srv://raptor:Raptor1769@mernnetflix.21nfmlg.mongodb.net/bookStore?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
    console.log("DB Connected");
  })
  .catch((err) => console.error(err));
