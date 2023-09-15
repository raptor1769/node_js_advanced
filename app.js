const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGO_DB_URI =
  "mongodb+srv://raptor:Raptor1769@mernnetflix.21nfmlg.mongodb.net/bookStore?retryWrites=true&w=majority";
const errorController = require("./controllers/error");

const store = MongoDBStore({
  uri: MONGO_DB_URI,
  collection: "sessions",
});

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "some secret key used for hashing",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    app.listen(3000);
    console.log("DB Connected");
  })
  .catch((err) => console.error(err));
