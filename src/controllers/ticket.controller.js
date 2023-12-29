const db = require("../models");
const Ticket = db.ticket;
const Organization = db.organization;
const SuspendedUser = db.suspended_user;

addTicket = async (req, res) => {
    const userId = req.body.userId;
    const organizationId = req.body.organizationId;

    const organization = await Organization.findOne({_id: organizationId});
    const suspendedUser = await SuspendedUser.findOne({
        user: userId,
        organization: organizationId
    })
        .populate('user')
        .populate('organization')
        .exec();

    if (suspendedUser) {
        res.status(403).send({message: "You are Suspended!"});
    }

    const ticketCount = await Ticket.countDocuments({
        created_by: userId,
        status: {$ne: 'closed'}
    });

    if (ticketCount >= 30) {
        res.status(403).send({message: "You can not have more than 30 open tickets!"});
    }

    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        created_by: userId,
        assignee: organization.admin._id,
        organization: organizationId,
        type: req.body.type
    });

    if (req.body.deadline) {
        const deadline = new Date(req.body.deadline);
        if (deadline <= new Date()) {
            res.status(403).send({message: "Deadline must be after now!!"});
        }
        ticket.deadline = deadline;
    }

    try {
        await ticket.save();
    } catch (e) {
        res.status(500).send({message: e});
    }


};


const TicketControllers = {
    addTicket
}

module.exports = TicketControllers;