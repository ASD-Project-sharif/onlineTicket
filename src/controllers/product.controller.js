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
const getProduct = async (req, res) => {
  await ProductServices.getProduct(req, res);
};

const getOrganizationProductsByOrganizationName = async (req, res) => {
  await ProductServices.getOrganizationProductsByOrganizationName(req, res);
};

const getOrganizationProductsByAgent = async (req, res) => {
  await ProductServices.getOrganizationProductsByAgent(req, res);
};


const ProductControllers = {
  addProduct,
  editProduct,
  getProduct,
  getOrganizationProductsByOrganizationName,
  deleteProduct,
  getOrganizationProductsByAgent,
};

module.exports = ProductControllers;
