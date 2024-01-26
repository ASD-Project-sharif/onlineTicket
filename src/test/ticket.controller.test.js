const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');
const TicketRepository = require('../repository/ticket.repository');
const SuspendedUserRepository = require('../repository/suspendedUser.repository');

const TimeServices = require('../services/time.services');
const TicketControllers = require('../controllers/ticket.controller');

const TicketStatus = require('../models/enums/ticketStatus.enum');
const TicketType = require('../models/enums/ticketType.enum');
const Ticket = require('../models/ticket.model');

const TicketServices = require('../services/ticket.services');




jest.mock('../repository/user.repository');
jest.mock('../repository/organization.repository');
jest.mock('../repository/ticket.repository');
jest.mock('../repository/suspendedUser.repository');

beforeEach(() => {
    jest.clearAllMocks();
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Ticket Controllers', () => {
    validUserShouldCreateTicketSuccessfully();
    onlyNormalUserCanCreateTicket();
    userCanNotCreateTicketWithDeadlineBeforeNow();
    userCanNotCreateTicketWithTitleMoreThan100Length();

    validUserShouldEditValidTicket();
    userCanNotEditTicketThatIsClosed();
    userCanNotEditOthersTicket();

    organizationUserShouldCloseTicket();

    getUserTicketsTests();
    getOrganizationTicketsTests();
    getTicketTests();
});

/**
 * @private
 */
function validUserShouldCreateTicketSuccessfully() {
    test('create ticket', async () => {
        jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(UserRepository, 'isNormalUser').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => false);
        jest.spyOn(TicketRepository, 'hasUserReachedToMaximumOpenTicket').mockImplementation((pass, salt, cb) => false);
        jest.spyOn(OrganizationRepository, 'getOrganizationAdminId').mockImplementation((pass, salt, cb) => 'adminId');
        TicketRepository.createNewTicket.mockResolvedValueOnce({_id: 'ticketId'});

        const res = mockResponse();
        const ticketMockData = {
            type: 'bug',
            title: 'test title',
            description: 'test description',
            organizationId: 'orgId',
        };

        await TicketControllers.addTicket({body: ticketMockData, userId: 'userId'}, res);
        expect(TicketRepository.createNewTicket).toHaveBeenCalledWith({
            title: 'test title',
            description: 'test description',
            created_by: 'userId',
            assignee: 'adminId',
            organization: 'orgId',
            type: 'bug',
        });
        expect(res.send).toHaveBeenCalledWith({message: 'Ticket added successfully!', id: 'ticketId'});
    });
}

/**
 * @private
 */
function onlyNormalUserCanCreateTicket() {
    test(
        'create ticket - not a normal user',
        async () => {
            jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockImplementation((pass, salt, cb) => true);
            jest.spyOn(UserRepository, 'isNormalUser').mockImplementation((pass, salt, cb) => false);

            const ticketMockData = {
                type: 'bug',
                title: 'test title',
                description: 'test description',
                organizationId: 'orgId',
            };
            const res = mockResponse();

            await TicketControllers.addTicket({body: ticketMockData, userId: 'userId'}, res);
            expect(res.send).toHaveBeenCalledWith({message: 'Only normal users can create ticket'});
        });
}

/**
 * @private
 */
function userCanNotCreateTicketWithDeadlineBeforeNow() {
    test('ticket deadline',
        async () => {
            const deadlineMock = TimeServices.Now();
            deadlineMock.setHours(deadlineMock.getHours() - 2);

            const ticketMockData = {
                type: 'bug',
                title: 'test title',
                description: 'test description',
                organizationId: 'orgId',
                deadline: deadlineMock.toString(),
            };
            const res = mockResponse();

            await TicketControllers.addTicket({body: ticketMockData, userId: 'userId'}, res);
            expect(res.send).toHaveBeenCalledWith({message: 'Deadline must be after now!!'});
            expect(res.status).toHaveBeenCalledWith(400);
        });
}

/**
 * @private
 */
function userCanNotCreateTicketWithTitleMoreThan100Length() {
    test('ticket title',
        async () => {
            const ticketMockData = {
                type: 'bug',
                title: new Array(101).fill('test title').join(''),
                description: 'test description',
                organizationId: 'orgId',
            };
            const res = mockResponse();

            await TicketControllers.addTicket({body: ticketMockData, userId: 'userId'}, res);
            expect(res.send).toHaveBeenCalledWith(
                {message: 'Title length should be less than or equal to 100 characters.'});
            expect(res.status).toHaveBeenCalledWith(400);
        });
}

/**
 * @private
 */
function validUserShouldEditValidTicket() {
    test('edit ticket', async () => {
        jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(TicketRepository, 'getTicketReporterId').mockImplementation((pass, salt, cb) => 'userId');

        const Now = TimeServices.Now();
        jest.spyOn(TimeServices, 'Now').mockImplementation((pass, salt, cb) => Now);

        const res = mockResponse();
        const ticketMockData = {
            title: 'test title',
            description: 'test description',
        };

        await TicketControllers.editTicket({body: ticketMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
        expect(TicketRepository.editTicket).toHaveBeenCalledWith('ticketId', {
            ...ticketMockData,
            'updated_at': Now,
        });
        expect(res.send).toHaveBeenCalledWith({message: 'ticket edited successfully'});
    });
}

/**
 * @private
 */
function userCanNotEditTicketThatIsClosed() {
    test('edit closed ticket', async () => {
        jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => false);

        const res = mockResponse();
        const ticketMockData = {
            title: 'test title',
            description: 'test description',
            organizationId: 'orgId',
        };

        await TicketControllers.editTicket({body: ticketMockData, userId: 'userId', params: {id: 'ticketId'}}, res);

        expect(res.send).toHaveBeenCalledWith({message: 'you can not edit closed ticket!'});
        expect(res.status).toHaveBeenCalledWith(403);
    });
}

/**
 * @private
 */
function userCanNotEditOthersTicket() {
    test('edit others ticket', async () => {
        jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(TicketRepository, 'getTicketReporterId').mockImplementation((pass, salt, cb) => 'fake');

        const res = mockResponse();
        const ticketMockData = {
            title: 'test title',
            description: 'test description',
            organizationId: 'orgId',
        };

        await TicketControllers.editTicket({body: ticketMockData, userId: 'userId', params: {id: 'ticketId'}}, res);

        expect(res.send).toHaveBeenCalledWith({message: 'this ticket does not belong to you!'});
        expect(res.status).toHaveBeenCalledWith(403);
    });
}

/**
 * @private
 */
function organizationUserShouldCloseTicket() {
    test('close ticket', async () => {
        jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
        jest.spyOn(UserRepository, 'isOrganizationUser').mockImplementation((pass, salt, cb) => true);

        const Now = TimeServices.Now();
        jest.spyOn(TimeServices, 'Now').mockImplementation((pass, salt, cb) => Now);

        const ticketMockData = {open: false};
        const res = mockResponse();

        await TicketControllers.changeStatus({body: ticketMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
        expect(TicketRepository.editTicket).toHaveBeenCalledWith('ticketId', {
            status: TicketStatus.CLOSED,
            updated_at: Now,
        });
        expect(res.send).toHaveBeenCalledWith({message: 'Ticket Closed'});
    });
}

/**
 * @private
 */
function getUserTicketsTests() {
    test('get user tickets', async () => {
        const userTickets = [generateMockTicket(), generateMockTicket()];

        jest.spyOn(TicketServices, 'getTicketsByUser').mockImplementation(async (req, res) => {
            res.send(userTickets);
        });

        const res = mockResponse();
        await TicketControllers.getUserTickets({ params: { userId: 'userId' } }, res);

        expect(TicketServices.getTicketsByUser).toHaveBeenCalledWith(expect.objectContaining({ params: { userId: 'userId' } }), res);
        expect(res.send).toHaveBeenCalledWith(userTickets);
    });
}


/**
 * @private
 */
function getOrganizationTicketsTests() {
    test('get organization tickets', async () => {
        const organizationId = 'mockOrganizationId';
        const mockTickets = [
            generateMockTicket(),
            generateMockTicket(),
        ];

        jest.spyOn(TicketServices, 'getTicketsByOrganization').mockImplementationOnce((req, res) => {
            return res.send(mockTickets);
        });

        const req = { params: { organizationId } };
        const res = mockResponse();

        await TicketControllers.getOrganiztionTickets(req, res);

        expect(TicketServices.getTicketsByOrganization).toHaveBeenCalledWith(req, res);
        expect(res.send).toHaveBeenCalledWith(mockTickets);
        expect(res.status).not.toHaveBeenCalled();
    });
}

/**
 * @private
 */
function getTicketTests() {
    test('get ticket by ID', async () => {
        const ticketId = 'mockTicketId';
        const mockTicket = generateMockTicket();

        jest.spyOn(TicketServices, 'getTicket').mockImplementationOnce((req, res) => {
            return res.send(mockTicket);
        });

        const req = { params: { id: ticketId } };
        const res = mockResponse();

        await TicketControllers.getTicket(req, res);

        expect(TicketServices.getTicket).toHaveBeenCalledWith(req, res);
        expect(res.send).toHaveBeenCalledWith(mockTicket);
        expect(res.status).not.toHaveBeenCalled();
    });
}

/**
 * Generates mock ticket data for testing purposes
 * @returns {Object} Mock ticket data
 */
function generateMockTicket() {
    return {
        _id: 'mockTicketId',
        title: 'Mock Ticket Title',
        description: 'Mock Ticket Description',
        created_by: 'mockUserId',
        assignee: 'mockAssigneeId',
        organization: 'mockOrganizationId',
        status: TicketStatus.WAITING_FOR_ADMIN,
        type: TicketType.BUG,
        created_at: new Date(),
        updated_at: new Date(),
        deadline: null,
    };
}


/**
 * @return {{}}
 */
function mockResponse() {
    return {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
}