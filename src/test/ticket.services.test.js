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
    describe('getTicketsByOrganization', () => {
        it('should get tickets by organization for agent', async () => {
            // ... (rest of the code)
        });
    });

    describe('getTicketsByUser', () => {
        it('should get tickets by user', async () => {
            // ... (rest of the code)
        });
    });

    describe('getTicket', () => {
        it('should get a ticket by ID', async () => {
            // ... (rest of the code)
        });
    });
});

describe('Ticket Controllers Unit Tests', () => {
    describe('validUserShouldCreateTicketSuccessfully', () => {
        it('should create ticket successfully for a valid user', async () => {
            // ... (rest of the code)
        });
    });

    describe('getTicketsWithFilterAndSorting', () => {
        it('should get tickets with filter and sorting for user', async () => {
            // ... (rest of the code)
        });
    });

    describe('sliceListByPagination', () => {
        it('should slice list by pagination', async () => {
            // ... (rest of the code)
        });
    });

    describe('calculateDeadlineStatus', () => {
        it('should calculate deadline status as passed', () => {
            // ... (rest of the code)
        });

        it('should calculate deadline status as near', () => {
            // ... (rest of the code)
        });

        it('should calculate deadline status as normal', () => {
            // ... (rest of the code)
        });
    });

    describe('setTicketsDeadlineStatus', () => {
        it('should set deadline status for each ticket', () => {
            // ... (rest of the code)
        });
    });

    /**
     * @private
     */
    function mockResponse() {
        return {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    }
});
