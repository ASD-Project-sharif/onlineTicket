const {
  createDocument, getDocumentById, updateDocumentById,
} = require('../dataAccess/dataAccess');

createNewProduct = async (data) => {
  return await createDocument('Product', data);
};

editProduct = async (productId, data) => {
  return await updateDocumentById('Product', productId, data);
};

hasProductExist = async (productId) => {
  const product = await getDocumentById('Product', productId);
  return product !== null;
};

getProductOrganizationId = async (productId) => {
  const product = await getDocumentById('Product', productId);
  return product.organization._id.toString();
};

const ProductRepository = {
  createNewProduct,
  editProduct,
  hasProductExist,
  getProductOrganizationId,
};

module.exports = ProductRepository;
