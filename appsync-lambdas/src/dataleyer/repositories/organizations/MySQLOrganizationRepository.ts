import { context, InvocationContext } from '../../../libs/invocation';
import { MySQLClient } from '../../../libs/mysql-client';

export class MySQLOrganizationRepository {
  private context: InvocationContext<{ logger }>;
  private db;
  private connection = undefined;

  constructor() {
    this.context = context<{ logger }>();
    this.db = new MySQLClient({
      host: process.env.ORGANIZATIONS_PROXY_ENDPOINT,
      user: process.env.ORGANIZATIONS_USER_NAME,
      database: process.env.ORGANIZATIONS_DB_NAME,
      port: 3306,
      region: 'us-east-1',
    });
  }

  private async connect() {
    if (!this.connection) {
      this.connection = await this.db.connect();
    }
  }

  async getSOIDByIntegrationID(integrationID: string) {
    await this.connect();

    // TODO: test what will be in the rows after I'll be able to run lambda
    const [rows, fields] = await this.connection.execute(`
      SELECT Organizations.SOID
      FROM Teams
      JOIN Organizations ON Teams.SOID = Organizations.SOID
      WHERE Teams.IntegrationID = ${integrationID}
    `);

    console.log(rows);

    this.connection.end();
  }
}
