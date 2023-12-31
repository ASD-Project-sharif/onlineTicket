const mongoose = require('mongoose');

async function createDocument(modelName, data) {
    const Model = mongoose.model(modelName);
    const newDocument = new Model(data);
    return await newDocument.save();
}

async function getAllDocuments(modelName) {
    const Model = mongoose.model(modelName);
    return Model.find();
}

async function getDocumentById(modelName, id) {
    const Model = mongoose.model(modelName);
    const document = Model.findById(id);
    return document;
}

async function updateDocumentById(modelName, id, data) {
    const Model = mongoose.model(modelName);
    const document = Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return document;
}

async function deleteDocumentById(modelName, id) {
    const Model = mongoose.model(modelName);
    return Model.findByIdAndDelete(id);
}

async function countDocuments(modelName) {
    const Model = mongoose.model(modelName);
    return Model.estimatedDocumentCount();
}

async function countDocumentsByQuery(modelName, query) {
    const Model = mongoose.model(modelName);
    return Model.countDocuments(query);
}

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
    countDocumentsByQuery
};
