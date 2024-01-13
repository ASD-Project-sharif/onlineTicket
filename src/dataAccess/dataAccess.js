const mongoose = require('mongoose');

/**
 * @return {Promise<*>}
 * @param {string} modelName
 * @param {array} data
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
 * @param {*} id
 */
async function getDocumentById(modelName, id) {
  const Model = mongoose.model(modelName);
  const document = Model.findById(id);
  return document;
}

/**
 * @param {string} modelName
 * @param {string} id
 * @param {array} data
 */
async function updateDocumentById(modelName, id, data) {
  const Model = mongoose.model(modelName);
  const document = Model.findByIdAndUpdate(id, data, {
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
 * @param {array} query
 */
async function countDocumentsByQuery(modelName, query) {
  const Model = mongoose.model(modelName);
  return Model.countDocuments(query);
}

/**
 * @param {string} modelName
 * @param {array} query
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
};
