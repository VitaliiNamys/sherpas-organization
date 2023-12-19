const Organizations = [
  {
    SOID: '1',
    Name: 'Organization A',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Active',
  },
  {
    SOID: '2',
    Name: 'Organization B',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Pending',
  },
  {
    SOID: '3',
    Name: 'Organization C',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Active',
  },
];

const Teams = [
  {
    STID: '101',
    SOID: '1',
    IntegrationID: 'IntegrationID_101',
    Name: 'Team X',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Active',
  },
  {
    STID: '102',
    SOID: '2',
    IntegrationID: 'IntegrationID_102',
    Name: 'Team Y',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Pending',
  },
  {
    STID: '103',
    SOID: '3',
    IntegrationID: 'IntegrationID_103',
    Name: 'Team Z',
    Created: new Date().toISOString(),
    Updated: new Date().toISOString(),
    Status: 'Active',
  },
];

const DB = {
  Organizations,
  Teams,
};

export class MySQLOrganizationRepositoryMock {
  async getOrganizationByIntegrationID(integrationID: string) {
   const team = DB.Teams.find((t) => t.IntegrationID === integrationID);

   if (!team) {
    return null;
   }

   const organization = DB.Organizations.find((o) => o.SOID === team.SOID);

   return organization ?? null;
  }
}
