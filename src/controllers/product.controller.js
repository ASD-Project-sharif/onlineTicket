const ProductServices = require('../services/product.services');

addProduct = async (req, res) => {
  await ProductServices.createProduct(req, res);
};

editProduct = async (req, res) => {
  await ProductServices.editProduct(req, res);
};

deleteProduct = async (req, res) => {
  await ProductServices.deleteProduct(req, res);
};

const ProductControllers = {
  addProduct,
  editProduct,
  deleteProduct,
};

module.exports = ProductControllers;
