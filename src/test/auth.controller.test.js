const {createDocument, findOneDocument} = require('../dataAccess/dataAccess');

const AuthControllers = require('../controllers/auth.controller');
const bcrypt = require('bcryptjs');
const UserRole = require('../models/enums/userRoles.enum');

jest.mock('../dataAccess/dataAccess');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Authentication Controllers', () => {
  test('signup should register a new user successfully', async () => {
    jest.spyOn(bcrypt, 'hashSync').mockImplementation((pass, salt, cb) => '12345');
    const userMockData = {
      username: 'testuser',
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Testpassword1@',
      confirm: 'Testpassword1@',
    };

    const res = {
      status: jest.fn().mockReturnThis(), // This line
      send: jest.fn(), // also mocking for send function
    };


    createDocument.mockResolvedValueOnce();

    await AuthControllers.signup({body: userMockData}, res);
    delete userMockData.confirm;
    expect(createDocument).toHaveBeenCalledWith('User', {...userMockData, password: '12345', role: 'user'});
    // expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({message: 'User was registered successfully!'});
  });

  test(
      'signupOrganization should register a new organization and admin successfully',
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

        const res = {
          status: jest.fn().mockReturnThis(), // This line
          send: jest.fn(), // also mocking for send function
        };

        createDocument.mockResolvedValueOnce({_id: 'orgId'});
        createDocument.mockResolvedValueOnce();

        await AuthControllers.signupOrganization({body: {...organizationMockData, ...adminUserMockData}}, res);

        expect(createDocument).toHaveBeenCalledWith('Organization', {
          'description': 'Test Organization Description',
          'name': 'TestOrg',
        });

        delete adminUserMockData.confirm;
        expect(createDocument).toHaveBeenCalledWith('User', {
          ...adminUserMockData,
          organization: 'orgId',
          role: UserRole.ADMIN,
          password: '12345',
        });
        // expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({message: 'Admin was registered successfully!'});
      });

  test('signin should sign in a user and return a valid JWT token',
      async () => {
        jest.spyOn(bcrypt, 'compareSync').mockImplementation((pass, salt, cb) => true);

        const existingUserMockData = {
          username: 'testuser',
          password: 'Testpassword1@',
        };

        const res = mockResponse();

        findOneDocument.mockResolvedValueOnce({
          _id: 'userId',
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'hashedPassword',
          role: UserRole.USER,
        });

        await AuthControllers.signin({body: existingUserMockData}, res);

        expect(findOneDocument).toHaveBeenCalledWith('User', {username: 'testuser'});
        expect(res.status).toHaveBeenCalledWith(200);
        // Add more assertions based on your specific requirements
      });
});

/**
 *
 * @return {{}}
 */
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}
