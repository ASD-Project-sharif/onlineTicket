const ProductServices = require('../services/product.services');

addProduct = async (req, res) => {
  await ProductServices.createProduct(req, res);
};

editProduct = async (req, res) => {
  await ProductServices.editProduct(req, res);
};

getProduct = async (req, res) => {
  await ProductServices.getProduct(req, res);
};

getOrganizationProducts = async (req, res) => {
  await ProductServices.getOrganizationProducts(req, res);
}


const ProductControllers = {
  addProduct,
  editProduct,
  getProduct,
  getOrganizationProducts,
};

module.exports = ProductControllers;
