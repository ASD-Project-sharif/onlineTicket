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
  deleteProduct,
};

module.exports = ProductControllers;
