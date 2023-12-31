const mongoose = require("mongoose");
const TicketType = require("./enums/ticketType.enum");
const TicketStatus = require("./enums/ticketStatus.enum");

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
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
        enum: Object.values(TicketStatus),
        default: TicketStatus.WAITING_FOR_ADMIN
    },
    type: {
        type: String,
        enum: Object.values(TicketType),
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


const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
