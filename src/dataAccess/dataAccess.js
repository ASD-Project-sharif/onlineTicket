const mongoose = require('mongoose');

async function createDocument(modelName, data) {
    try {
        const Model = mongoose.model(modelName);
        const newDocument = new Model(data);
        const savedDocument = await newDocument.save();
        return savedDocument;
    } catch (error) {
        throw error;
    }
}

async function getAllDocuments(modelName) {
    try {
        const Model = mongoose.model(modelName);
        const documents = await Model.find();
        return documents;
    } catch (error) {
        throw error;
    }
}

async function getDocumentById(modelName, id) {
    try {
        const Model = mongoose.model(modelName);
        const document = await Model.findById(id);
        return document;
    } catch (error) {
        throw error;
    }
}

async function updateDocumentById(modelName, id, data) {
    try {
        const Model = mongoose.model(modelName);
        const updatedDocument = await Model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        return updatedDocument;
    } catch (error) {
        throw error;
    }
}

async function deleteDocumentById(modelName, id) {
    try {
        const Model = mongoose.model(modelName);
        const deletedDocument = await Model.findByIdAndDelete(id);
        return deletedDocument;
    } catch (error) {
        throw error;
    }
}

async function countDocuments(modelName) {
    try {
        const Model = mongoose.model(modelName);
        return Model.estimatedDocumentCount();
    } catch (error) {
        throw error;
    }
}

async function findOneDocument(modelName, query) {
    try {
        const Model = mongoose.model(modelName);
        const document = await Model.findOne(query).exec();
        return document;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocumentById,
    deleteDocumentById,
    countDocuments,
    findOneDocument
};
