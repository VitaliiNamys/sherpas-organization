import { context, InvocationContext } from '../../middleware/invocation';
import { MySQLClient } from '../../clients/mysql-client';

const Organizations = [
  {
    SOID: '1',
    Name: 'Organization A',
    Created: '',
    Updated: '',
    Status: 'Active',
  },
  {
    SOID: '2',
    Name: 'Organization B',
    Created: '',
    Updated: '',
    Status: 'Pending',
  },
  {
    SOID: '3',
    Name: 'Organization C',
    Created: '',
    Updated: '',
    Status: 'Active',
  },
];

const Teams = [
  {
    STID: '101',
    SOID: '1',
    IntegrationID: 'IntegrationID_101',
    Name: 'Team X',
    Created: '',
    Updated: '',
    Status: 'Active',
  },
  {
    STID: '102',
    SOID: '2',
    IntegrationID: 'IntegrationID_102',
    Name: 'Team Y',
    Created: '',
    Updated: '',
    Status: 'Pending',
  },
  {
    STID: '103',
    SOID: '3',
    IntegrationID: 'IntegrationID_103',
    Name: 'Team Z',
    Created: '',
    Updated: '',
    Status: 'Active',
  },
];

const DB = {
  Organizations,
  Teams,
};

export class MySQLOrganizationRepository {
  private context: InvocationContext;
  private db;
  private connection = undefined;

  constructor() {
    this.context = context<{ logger }>();
    this.db = new MySQLClient({
      host: process.env.ORGANIZATIONS_PROXY_ENDPOINT,
      user: process.env.ORGANIZATIONS_USER_NAME,
      database: process.env.ORGANIZATIONS_DB_NAME,
      port: 3306,
      region: process.env.ORGANIZATIONS_REGION,
    });
  }

  private async connect() {
    if (!this.connection) {
      this.connection = await this.db.connect();
    }
  }

  async getOrganizationByIntegrationID(integrationID: string) {
   const team = DB.Teams.find((t) => t.IntegrationID === integrationID);

   if (!team) {
    return null;
   }

   const organization = DB.Organizations.find((o) => o.SOID === team.SOID);

   return organization ?? null;
  }

  async getSOIDByIntegrationID(integrationID: string) {
   const team = DB.Teams.find((t) => t.IntegrationID === integrationID);

   return team?.SOID ?? null;
  }

  // async getSOIDByIntegrationID(integrationID: string) {
  //   await this.connect();

  //   const [rows] = await this.connection.execute(`
  //     SELECT Organizations.SOID
  //     FROM Teams
  //     JOIN Organizations ON Teams.SOID = Organizations.SOID
  //     WHERE Teams.IntegrationID = "${integrationID}"
  //   `);

  //   this.connection.end();

  //   if (rows.length > 0) {
  //     return rows[0].SOID;
  //   } else {
  //     this.context.logger.error(`Failed to get SOID by ${integrationID}`);
  //   }
  // }
}
