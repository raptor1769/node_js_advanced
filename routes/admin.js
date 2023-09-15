const path = require("path");
const express = require("express");

// const rootDir = require("../utils/path");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
