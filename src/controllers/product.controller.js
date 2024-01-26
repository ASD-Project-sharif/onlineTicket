const ProductServices = require('../services/product.services');

addProduct = async (req, res) => {
  await ProductServices.createProduct(req, res);
};

const ProductControllers = {
  addProduct,
};

module.exports = ProductControllers;
