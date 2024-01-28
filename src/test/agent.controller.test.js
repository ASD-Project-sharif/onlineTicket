const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');

const AgentControllers = require('../controllers/agent.controller');
const PasswordServices = require('../services/password.services');

jest.mock('../repository/user.repository');

beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Agent Controllers', () => {
  validUserShouldAddAgentSuccessfully();
  onlyAdminCanAddNewAgent();
  agentCanNotBeAddedWithWeekPassword();
});

/**
 * @private
 */
function validUserShouldAddAgentSuccessfully() {
  test('add agent', async () => {
    jest.spyOn(PasswordServices, 'getPasswordHash').mockImplementation((pass, salt, cb) => '12345');
    jest.spyOn(UserRepository, 'isAdmin').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(OrganizationRepository, 'getOrganizationIdByAgentId').mockImplementation((pass, salt, cb) => 'orgId');
    const agentMockData = {
      username: 'testuser',
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Testpassword1@',
      confirm: 'Testpassword1@',
    };

    const res = mockResponse();

    await AgentControllers.addAgent({body: agentMockData, userId: 'userId'}, res);
    delete agentMockData.confirm;
    expect(UserRepository.createNewUser)
        .toHaveBeenCalledWith({...agentMockData, password: '12345', role: 'agent', organization: 'orgId'});
    expect(res.send).toHaveBeenCalledWith({message: 'User was registered successfully!'});
  });
}

/**
 * @private
 */
function onlyAdminCanAddNewAgent() {
  test('not admin', async () => {
    jest.spyOn(UserRepository, 'isAdmin').mockImplementation((pass, salt, cb) => false);

    const agentMockData = {
      password: 'Testpassword1@',
      confirm: 'Testpassword1@',
    };

    const res = mockResponse();
    await AgentControllers.addAgent({body: agentMockData, userId: 'userId'}, res);

    expect(res.send).toHaveBeenCalledWith({message: 'you do not have the right access!'});
    expect(res.status).toHaveBeenCalledWith(403);
  });
}

/**
 * @private
 */
function agentCanNotBeAddedWithWeekPassword() {
  test('week password', async () => {
    const agentMockData = {
      password: 'Testweekpasswor',
    };

    const res = mockResponse();
    await AgentControllers.addAgent({body: agentMockData}, res);
    expect(res.send).toHaveBeenCalledWith({message: 'password is not difficult enough!'});
    expect(res.status).toHaveBeenCalledWith(400);
  });
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
