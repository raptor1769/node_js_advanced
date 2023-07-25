const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error")
// const expHandleBars = require("express-handlebars"); //this is only handlebar specific

const app = express();

// app.engine(
//   "hbs",
//   expHandleBars({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// ); //this is only handlebar specific, note: the first value you pass in this function is the file extension

app.set("view engine", "ejs");
// app.set("view engine", "hbs"); //this is only handlebar specific
// app.set("view engine", "pug"); //this is pug specific
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

app.listen(3000, () => console.log("server running on port 3000"));
