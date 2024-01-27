const mongoose = require('mongoose');

/**
 * @return {Promise<*>}
 * @param {string} modelName
 * @param {{}} data
 */
async function createDocument(modelName, data) {
  const Model = mongoose.model(modelName);
  const newDocument = new Model(data);
  return await newDocument.save();
}

/**
 * @param {string}modelName
 */
async function getAllDocuments(modelName) {
  const Model = mongoose.model(modelName);
  const documents = Model.find();
  return documents;
}

/**
 * @param {string} modelName
 * @param {{}} query
 * @param {{}} options
 * @return {{}}
 */
async function getAllPopulatedDocumentsWithFilterAndSort(modelName, query, options) {
  const Model = mongoose.model(modelName);
  const result = await Model.find(query)
      .populate('organization', 'name')
      .populate('assignee', 'username')
      .populate('created_by', 'username')
      .sort(options)
      .lean();

  return result;
}

/**
 * @param {string} modelName
 * @param {{}} query
 * @return {{}}
 */
async function getAllPopulatedProducts(modelName, query) {
  const Model = mongoose.model(modelName);
  const result = await Model.find(query)
                            .populate('organization', 'name')
                            .lean();
  return result;
}

/**
 * @param {string} modelName
 * @param {*} id
 */
async function getDocumentById(modelName, id) {
  const Model = mongoose.model(modelName);
  const document = await Model.findById(id);
  return document;
}

/**
 * @param {string} modelName
 * @param  {string} id
 * @return {{}}
 */
async function getPopulatedDocumentById(modelName, id) {
  const Model = mongoose.model(modelName);
  const document = await Model.findById(id)
      .populate('organization', 'name')
      .populate('assignee', 'username')
      .populate('created_by', 'username')
      .lean();

  return document;
}

/**
 * @param {string} modelName
 * @param  {string} id
 * @return {{}}
 */
async function getPopulatedProductById(modelName, id) {
  const Model = mongoose.model(modelName);
  const document = await Model.findById(id)
                              .populate('organization', 'name')
                              .lean();
  return document;
}

/**
 * @param {string} modelName
 * @param {{}} query
 * @return {{}}
 */
async function getPopulatedDocumentsByQuery(modelName, query) {
  const Model = mongoose.model(modelName);
  const documents = await Model.find(query)
      .populate('organization', 'name')
      .populate('assignee', 'username')
      .populate('created_by', 'username')
      .lean();
  return documents;
}

/**
 * @param {string} modelName
 * @param {string} id
 * @param {{}} data
 */
async function updateDocumentById(modelName, id, data) {
  const Model = mongoose.model(modelName);
  const document = await Model.findByIdAndUpdate(id, data, {
    new: true, runValidators: true,
  });
  return document;
}

/**
 * @param {string} modelName
 * @param {string} id
 */
async function deleteDocumentById(modelName, id) {
  const Model = mongoose.model(modelName);
  return Model.findByIdAndDelete(id);
}

/**
 * @param {string} modelName
 */
async function countDocuments(modelName) {
  const Model = mongoose.model(modelName);
  return Model.estimatedDocumentCount();
}

/**
 * @param {string} modelName
 * @param {{}} query
 */
async function countDocumentsByQuery(modelName, query) {
  const Model = mongoose.model(modelName);
  return Model.countDocuments(query);
}

/**
 * @param {string} modelName
 * @param {{}} query
 */
async function findOneDocument(modelName, query) {
  const Model = mongoose.model(modelName);
  const document = await Model.findOne(query).exec();
  return document;
}

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  countDocuments,
  findOneDocument,
  countDocumentsByQuery,
  getAllPopulatedDocumentsWithFilterAndSort,
  getPopulatedDocumentById,
  getPopulatedDocumentsByQuery,
  getPopulatedProductById,
  getAllPopulatedProducts,
};
