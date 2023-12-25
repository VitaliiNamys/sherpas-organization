import { MySQLOrganizationRepository } from '../MySQLOrganizationRepository';

jest.mock('../../../middleware/invocation', () => ({
  context: jest.fn().mockImplementation(() => ({
    logger: { error: jest.fn() } })),
}));

const MySQLClientExecuteMock = jest.fn();

jest.mock('../../../clients/mysql-client', () => ({
  MySQLClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({
      execute: MySQLClientExecuteMock,
      end: jest.fn(),
    }),
  })),
}));

describe('MySQLOrganizationRepository', () => {
  const mockIntegrationId = 'integrationID';
  const dbOrganizationRecordMock = {
    SOID: '1',
    Name: 'Organization A',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Active',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrganizationByIntegrationID()', () => {
    test('should return Organiztion by IntegrationID', async () => {
      const repository = new MySQLOrganizationRepository();

      MySQLClientExecuteMock.mockResolvedValueOnce([[dbOrganizationRecordMock]]);

      const res = await repository.getOrganizationByIntegrationID(mockIntegrationId);

      expect(res).toEqual(dbOrganizationRecordMock);
    });

    test('should return null if there is no Organizations by such IntegrationID', async () => {
      const repository = new MySQLOrganizationRepository();

      MySQLClientExecuteMock.mockResolvedValueOnce([[]]);

      const res = await repository.getOrganizationByIntegrationID(mockIntegrationId);

      expect(res).toEqual(null);
    });

    test('should handle errors during DB operation', async () => {
      const repository = new MySQLOrganizationRepository();

      MySQLClientExecuteMock.mockRejectedValueOnce(new Error('DB error'));

      try {
        await repository.getOrganizationByIntegrationID(mockIntegrationId);
      } catch (error) {
        expect(error.message).toEqual('DB error');
      }
    });

  });
});
