const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    status: {
        type: String,
        enum: ["closed", "in_progress", "waiting_for_admin"],
        default: "waiting_for_admin"
    },
    type: {
        type: String,
        enum: ["bug", "question", "suggestion"],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    deadline: {
        type: Date,
        default: null
    }
});

// Middleware to update the 'updated_at' field before each 'update' operation
TicketSchema.pre('updateOne', function (next) {
    this.updateOne({}, {$set: {updated_at: new Date()}});
    next();
});

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
