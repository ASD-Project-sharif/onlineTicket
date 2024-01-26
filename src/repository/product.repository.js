const {
  createDocument,
} = require('../dataAccess/dataAccess');

createNewProduct = async (data) => {
  return await createDocument('Product', data);
};

const ProductRepository = {
  createNewProduct,
};

module.exports = ProductRepository;
