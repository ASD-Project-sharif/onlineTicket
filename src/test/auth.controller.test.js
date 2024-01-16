const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');

const AuthControllers = require('../controllers/auth.controller');
const PasswordServices = require('../services/password.services');
const UserRole = require('../models/enums/userRoles.enum');

jest.mock('../repository/user.repository');
jest.mock('../repository/organization.repository');

beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Authentication Controllers', () => {
  validUserShouldSignUpSuccessfully();
  validOrganizationShouldSignUpSuccessfully();
  validUserShouldSignInSuccessfully();

  userCanNotSignUpWithWeekPassword();
  userCanNotSignUpWhenConfirmingPasswordIsDifferent();
  userCanNotSignInWithWrongPassword();
});

/**
 * @private
 */
function validUserShouldSignUpSuccessfully() {
  test('signup user', async () => {
    jest.spyOn(PasswordServices, 'getPasswordHash').mockImplementation((pass, salt, cb) => '12345');
    const userMockData = {
      username: 'testuser',
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Testpassword1@',
      confirm: 'Testpassword1@',
    };

    const res = mockResponse();

    UserRepository.createNewUser.mockResolvedValueOnce();

    await AuthControllers.signup({body: userMockData}, res);
    delete userMockData.confirm;
    expect(UserRepository.createNewUser).toHaveBeenCalledWith({...userMockData, password: '12345', role: 'user'});
    expect(res.send).toHaveBeenCalledWith({message: 'User was registered successfully!'});
  });
}

/**
 * @private
 */
function validOrganizationShouldSignUpSuccessfully() {
  test(
      'signup Organization',
      async () => {
        const organizationMockData = {
          organizationName: 'TestOrg',
          organizationDescription: 'Test Organization Description',
        };

        const adminUserMockData = {
          username: 'testadmin',
          email: 'testadmin@example.com',
          password: 'Testpassword1@',
          confirm: 'Testpassword1@',
        };
        jest.spyOn(PasswordServices, 'getPasswordHash').mockImplementation((pass, salt, cb) => '12345');

        const res = mockResponse();

        OrganizationRepository.createNewOrganization.mockResolvedValueOnce({_id: 'orgId'});
        UserRepository.createNewUser.mockResolvedValueOnce({_id: 'adminId'});

        await AuthControllers.signupOrganization({body: {...organizationMockData, ...adminUserMockData}}, res);

        expect(OrganizationRepository.createNewOrganization).toHaveBeenCalledWith({
          'description': 'Test Organization Description',
          'name': 'TestOrg',
        });

        delete adminUserMockData.confirm;
        expect(UserRepository.createNewUser).toHaveBeenCalledWith({
          ...adminUserMockData,
          organization: 'orgId',
          role: UserRole.ADMIN,
          password: '12345',
        });

        expect(OrganizationRepository.editOrganization).toHaveBeenCalledWith('orgId', {
          '_id': 'orgId',
          'admin': 'adminId',
        });

        expect(res.send).toHaveBeenCalledWith({message: 'Admin was registered successfully!'});
      });
}

/**
 * @private
 */
function validUserShouldSignInSuccessfully() {
  test('signIn user',
      async () => {
        jest.spyOn(PasswordServices, 'arePasswordsEqual').mockImplementation((pass, salt, cb) => true);

        const existingUserMockData = {
          username: 'testuser',
          password: 'Testpassword1@',
        };

        const res = mockResponse();

        UserRepository.getByUsername.mockResolvedValueOnce({
          _id: 'userId',
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'hashedPassword',
          role: UserRole.USER,
        });

        await AuthControllers.signin({body: existingUserMockData}, res);

        expect(UserRepository.getByUsername).toHaveBeenCalledWith('testuser');
        expect(res.status).toHaveBeenCalledWith(200);
      });
}

/**
 * @private
 */
function userCanNotSignUpWithWeekPassword() {
  test('week password', async () => {
    const userMockData = {
      password: 'Testweekpasswor',
    };

    const res = mockResponse();
    await AuthControllers.signup({body: userMockData}, res);
    expect(res.send).toHaveBeenCalledWith({message: 'password is not difficult enough!'});
    expect(res.status).toHaveBeenCalledWith(400);
  });
}

/**
 * @private
 */
function userCanNotSignUpWhenConfirmingPasswordIsDifferent() {
  test('confirm password', async () => {
    const res = mockResponse();

    const userMockData = {
      password: 'Testpassword1@',
      confirm: 'Testpassword1%#',
    };

    await AuthControllers.signup({body: userMockData}, res);
    expect(res.send).toHaveBeenCalledWith({message: 'passwords are different!'});
    expect(res.status).toHaveBeenCalledWith(400);
  });
}

/**
 * @private
 */
function userCanNotSignInWithWrongPassword() {
  test('wrong password',
      async () => {
        const res = mockResponse();
        jest.spyOn(PasswordServices, 'getPasswordHash').mockImplementation((pass, salt, cb) => 'wrongpassword');

        const UserMockData = {
          username: 'testuser',
          password: 'wrongpassword',
        };
        UserRepository.getByUsername.mockResolvedValueOnce({
          password: 'hashedPassword',
        });

        await AuthControllers.signin({body: UserMockData}, res);

        expect(res.send).toHaveBeenCalledWith({message: 'User and Password combination is incorrect.'});
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
