const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');
const ProductRepository = require('../repository/product.repository');

const ProductControllers = require('../controllers/product.controller');

jest.mock('../repository/user.repository');
jest.mock('../repository/organization.repository');
jest.mock('../repository/ticket.repository');
jest.mock('../repository/product.repository');
jest.mock('../repository/comment.repository');

beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Product Controllers', () => {
  adminShouldCreateProductSuccessfully();
  adminCanNotCreateProductWithNameLengthMoreThan100();
  adminCanNotCreateProductWithDescriptionLengthMoreThan1000();
  onlyAdminCanCreateProduct();
  userCanNotCreateProductForAnotherOrganization();

  adminShouldEditProductSuccessfully();
  onlyAdminOfProductOrganizationCanEditProduct();

  adminShouldDeleteProductSuccessfully();
});

/**
 * @private
 */
function adminShouldCreateProductSuccessfully() {
  test('create product', async () => {
    jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockResolvedValue(true);
    jest.spyOn(UserRepository, 'isAdmin').mockResolvedValue(true);
    jest.spyOn(OrganizationRepository, 'getOrganizationAdminId').mockResolvedValue('userId');
    jest.spyOn(OrganizationRepository, 'getOrganizationIdByAgentId').mockResolvedValue('orgId');

    ProductRepository.createNewProduct.mockResolvedValue({_id: 'productId'});

    const res = mockResponse();
    const req = {
      body: {
        name: 'test name',
        description: 'test description',
      },
      userId: 'userId',
    };

    await ProductControllers.addProduct(req, res);
    expect(ProductRepository.createNewProduct).toHaveBeenCalledWith({
      name: 'test name',
      description: 'test description',
      organization: 'orgId',
    });

    expect(res.send).toHaveBeenCalledWith({message: 'Product added successfully!', id: 'productId'});
  });
}

/**
 * @private
 */
function adminCanNotCreateProductWithNameLengthMoreThan100() {
  test('name length', async () => {
    jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockResolvedValue(true);
    jest.spyOn(UserRepository, 'isAdmin').mockResolvedValue(true);

    const res = mockResponse();
    const req = {
      body: {
        name: 'Name Exceeding 100 Characters '.repeat(50),
        description: 'Valid Description',
        organizationId: 'orgId',
      },
      userId: 'userId',
    };

    await ProductControllers.addProduct(req, res);

    expect(ProductRepository.createNewProduct).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Name length should be less than or equal to 100 characters.',
    });
  },
  );
}

/**
 * @private
 */
function adminCanNotCreateProductWithDescriptionLengthMoreThan1000() {
  test('description length', async () => {
    jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockResolvedValue(true);
    jest.spyOn(UserRepository, 'isAdmin').mockResolvedValue(true);

    const res = mockResponse();
    const req = {
      body: {
        name: 'Valid Name',
        description: 'Description Exceeding 1000 Characters '.repeat(100),
        organizationId: 'orgId',
      },
      userId: 'userId',
    };

    await ProductControllers.addProduct(req, res);

    expect(ProductRepository.createNewProduct).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Description length should be less than or equal to 1000 characters.',
    });
  });
}

/**
 * @private
 */
function onlyAdminCanCreateProduct() {
  test('not admin user', async () => {
    jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockResolvedValue(true);
    jest.spyOn(UserRepository, 'isAdmin').mockResolvedValue(false);

    const res = mockResponse();
    const req = {
      body: {
        name: 'Valid Name',
        description: 'Valid Description',
        organizationId: 'orgId',
      },
      userId: 'userId',
    };

    await ProductControllers.addProduct(req, res);

    expect(ProductRepository.createNewProduct).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message: 'You do not have the right access!',
    });
  });
}

/**
 * @private
 */
function userCanNotCreateProductForAnotherOrganization() {
  test('other organization', async () => {
    jest.spyOn(OrganizationRepository, 'hasOrganizationExist').mockResolvedValue(true);
    jest.spyOn(UserRepository, 'isAdmin').mockResolvedValue(true);
    jest.spyOn(OrganizationRepository, 'getOrganizationAdminId').mockResolvedValue('adminId');

    const res = mockResponse();
    const req = {
      body: {
        name: 'Valid Name',
        description: 'Valid Description',
        organizationId: 'otherOrgId',
      },
      userId: 'userId',
    };

    await ProductControllers.addProduct(req, res);

    expect(ProductRepository.createNewProduct).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message: 'You can not create product for another organization!',
    });
  });
}

/**
 * @private
 */
function adminShouldEditProductSuccessfully() {
  test('edit product', async () => {
    jest.spyOn(ProductRepository, 'hasProductExist').mockResolvedValue(true);
    jest.spyOn(OrganizationRepository, 'getOrganizationAdminId').mockResolvedValue('adminId');
    jest.spyOn(UserRepository, 'isAdmin').mockResolvedValue(true);

    const res = mockResponse();
    const req = {
      body: {
        name: 'edited name',
        description: 'edited description',
      },
      userId: 'adminId',
      params: {
        id: 'productId',
      },
    };

    await ProductControllers.editProduct(req, res);

    expect(ProductRepository.editProduct).toHaveBeenCalledWith('productId', {
      name: 'edited name',
      description: 'edited description',
      updated_at: expect.any(Date),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({message: 'Product updated successfully!'});
  });
}

/**
 * @private
 */
function onlyAdminOfProductOrganizationCanEditProduct() {
  test('edit others product', async () => {
    jest.spyOn(ProductRepository, 'hasProductExist').mockResolvedValue(true);
    jest.spyOn(OrganizationRepository, 'getOrganizationAdminId').mockResolvedValue('adminId');

    const res = mockResponse();
    const req = {
      body: {
        name: 'edited name',
        description: 'edited description',
      },
      userId: 'userId',
      params: {
        id: 'productId',
      },
    };

    await ProductControllers.editProduct(req, res);

    expect(ProductRepository.editProduct).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'You do not have the right access!'});
  });
}

/**
 * @private
 */
function adminShouldDeleteProductSuccessfully() {
  test('delete product', async () => {
    jest.spyOn(ProductRepository, 'hasProductExist').mockResolvedValue(true);
    jest.spyOn(OrganizationRepository, 'getOrganizationAdminId').mockResolvedValue('adminId');

    const res = mockResponse();
    const req = {
      userId: 'adminId',
      params: {
        id: 'productId',
      },
    };

    await ProductControllers.deleteProduct(req, res);

    expect(ProductRepository.deleteProduct).toHaveBeenCalledWith('productId');
    expect(res.send).toHaveBeenCalledWith({message: 'Product deleted successfully!'});
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
