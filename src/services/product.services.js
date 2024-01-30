const OrganizationRepository = require('../repository/organization.repository');
const UserRepository = require('../repository/user.repository');
const ProductRepository = require('../repository/product.repository');
const PaginationServices = require('../services/pagination.services');
const TimeServices = require('../services/time.services');
const {INTEGER} = require('sequelize');

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {boolean}
 */
const isInputDataValid = (req, res) => {
  if (req.body.name.length > 100) {
    res.status(400).send(
        {message: 'Name length should be less than or equal to 100 characters.'});
    return false;
  }

  if (req.body.description.length > 1000) {
    res.status(400).send(
        {message: 'Description length should be less than or equal to 1000 characters.'});
    return false;
  }
  return true;
};

const canUserCreateProduct = async (req, res) => {
  const isAdmin = await UserRepository.isAdmin(req.userId);
  if (!isAdmin) {
    res.status(403).send({message: 'You do not have the right access!'});
    return false;
  }
  return true;
};
const canUserEditProduct = async (req, res) => {
  const productExist = await ProductRepository.hasProductExist(req.params.id);
  if (!productExist) {
    res.status(400).send({message: 'There is no product with this ID!'});
    return false;
  }
  const organizationId = await ProductRepository.getProductOrganizationId(req.params.id);
  const organizationAdminId = await OrganizationRepository.getOrganizationAdminId(organizationId);
  if (organizationAdminId !== req.userId) {
    res.status(403).send({message: 'You do not have the right access!'});
    return false;
  }
  return true;
};

const canUserFetchProduct = async (req, res) => {
  const productExist = await ProductRepository.hasProductExist(req.params.id);
  if (!productExist) {
    res.status(400).send({message: 'Product does not exist!'});
    return false;
  }
  return true;
};

const getOrganizationId = async (req, res) => {
  const userId = req.userId;
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(userId);
  if (!organizationId) {
    res.status(400).send({message: 'organization does not exist!'});
    return;
  }
  return organizationId;
};

createProduct = async (req, res) => {
  if (!isInputDataValid(req, res)) {
    return;
  }
  const organizationId = await getOrganizationId(req, res);
  const canCreateProduct = await canUserCreateProduct(req, res);
  if (!canCreateProduct || !organizationId) {
    return;
  }

  const product = {
    name: req.body.name,
    description: req.body.description,
    organization: organizationId,
  };
  if (req.body.logo) {
    product.logo = req.body.logo;
  }

  const productCreated = await ProductRepository.createNewProduct(product);

  res.status(200).send({
    message: 'Product added successfully!',
    id: productCreated._id,
  });
};

editProduct = async (req, res) => {
  if (!isInputDataValid(req, res)) {
    return;
  }
  const canEditProduct = await canUserEditProduct(req, res);
  if (!canEditProduct) {
    return;
  }

  const product = {
    name: req.body.name,
    description: req.body.description,
    updated_at: TimeServices.now(),
  };
  if (req.body.logo) {
    product.logo = req.body.logo;
  }

  await ProductRepository.editProduct(req.params.id, product);
  res.status(200).send({message: 'Product updated successfully!'});
};

deleteProduct = async (req, res) => {
  const canEditProduct = await canUserEditProduct(req, res);
  if (!canEditProduct) {
    return;
  }

  await ProductRepository.deleteProduct(req.params.id);
  res.send({message: 'Product deleted successfully!'});
};

const getProduct = async (req, res) => {
  const canSeeProdcut = await canUserFetchProduct(req, res);
  if (!canSeeProdcut) {
    return;
  }
  const product = await ProductRepository.getProductById(req.params.id);
  res.status(200).send({
    product,
    message: 'Product returned successfully!',
  });
};

const getOrganizationProductsById = async (req, res) => {
  const products = await ProductRepository.getOrganizationProducts(req.params.id);
  const slicedProducts = await sliceListByPagination(req, res, products);
  res.status(200).send({
    products: slicedProducts,
    count: products.length,
  });
};

const getOrganizationProductsByAgent = async (req, res) => {
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(req.userId);
  const products = await ProductRepository.getOrganizationProducts(organizationId);
  const slicedProducts = await sliceListByPagination(req, res, products);
  res.status(200).send({
    products: slicedProducts,
    count: products.length,
  });
};

const sliceListByPagination = async (req, res, list) => {
  const page = {
    size: req.query.pageSize,
    number: req.query.pageNumber,
  };
  if (page.size === undefined || page.number === undefined) {
    return list;
  }
  return await PaginationServices.sliceListByPagination(parseInt(page.size), parseInt(page.number), list);
};

const ProductServices = {
  createProduct,
  editProduct,
  deleteProduct,
  getOrganizationProductsById,
  getProduct,
  getOrganizationProductsByAgent,
};

module.exports = ProductServices;
