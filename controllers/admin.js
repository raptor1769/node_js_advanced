const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    //only for handlebars
    //   activeAddProduct: true,
    //   formsCSS: true,
    //   productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    return res.redirect("/");
  }
  const prodId = req.params.id;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
  // Product.findById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     docTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     editing: editMode,
  //     product: product,
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findByPk(prodId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  // const updatedProduct = new Product(
  //   prodId,
  //   title,
  //   imageUrl,
  //   description,
  //   price
  // );
  // updatedProduct.save();
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeShop: true,
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll((products) => {
  //   // res.render("shop", { prods: products, docTitle: "Shop", path: "/" });
  //   res.render("admin/products", {
  //     prods: products,
  //     docTitle: "Admin Products",
  //     path: "/admin/products",
  //     hasProducts: products.length > 0,
  //     activeShop: true,
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  Product.findByPk(prodId)
    .then((product) => product.destroy())
    .then((result) => {
      console.log("DELETED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
  // Product.deleteById(prodId);
};
