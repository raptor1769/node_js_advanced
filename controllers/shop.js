const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        hasProducts: products.length > 0,
        activeShop: true,
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       docTitle: "All Products",
  //       path: "/products",
  //       hasProducts: rows.length > 0,
  //       activeShop: true,
  //     });
  //   })
  //   .catch((err) => console.log(err));

  // Product.fetchAll((products) => {
  //   res.render("shop/product-list", {
  //     prods: products,
  //     docTitle: "All Products",
  //     path: "/products",
  //     hasProducts: products.length > 0,
  //     activeShop: true,
  //   });
  // });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
  // Product.findById(prodId)
  //   .then(([product]) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       docTitle: product[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/index", {
  //       prods: products,
  //       docTitle: "Shop",
  //       path: "/",
  //       hasProducts: rows.length > 0,
  //       activeShop: true,
  //     });
  //   })
  //   .catch((err) => console.log(err));
  // If DB is local file
  // Product.fetchAll((products) => {
  //   res.render("shop/index", {
  //     prods: products,
  //     docTitle: "Shop",
  //     path: "/",
  //     hasProducts: products.length > 0,
  //     activeShop: true,
  //   });
  // });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            docTitle: "Cart",
            path: "/cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       docTitle: "Cart",
  //       path: "/cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQty = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQty = product.cartItem.quantity;
        newQty = oldQty + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQty },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Product.findByPk(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      return res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "Your orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
  // res.render("shop/orders", {
  //   docTitle: "Your orders",
  //   path: "/orders",
  // });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };
