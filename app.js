const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
// const expHandleBars = require("express-handlebars"); //this is only handlebar specific

const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");

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

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({force: true})
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Drax", email: "drax@gmail.com" });
    }
    return user;
    // console.log(res);
  })
  .then((user) => {
    // console.log(user);
    user.createCart();
  })
  .then(() => {
    app.listen(3000, () => console.log("server running on port 3000"));
  })
  .catch((err) => console.log(err));
