const {
  createDocument, getDocumentById, updateDocumentById, deleteDocumentById,
} = require('../dataAccess/dataAccess');

createNewProduct = async (data) => {
  return await createDocument('Product', data);
};

editProduct = async (productId, data) => {
  return await updateDocumentById('Product', productId, data);
};

deleteProduct = async (productId) => {
  return await deleteDocumentById('Product', productId);
};

hasProductExist = async (productId) => {
  const product = await getDocumentById('Product', productId);
  return product !== null;
};

getProductOrganizationId = async (productId) => {
  const product = await getDocumentById('Product', productId);
  return product.organization._id.toString();
};

getProductById = async () => {

};

getOrganizationProductsByAgentId = async () => {

};

const ProductRepository = {
  createNewProduct,
  editProduct,
  deleteProduct,
  hasProductExist,
  getProductOrganizationId,
  getProductById,
  getOrganizationProductsByAgentId,
};

module.exports = ProductRepository;
