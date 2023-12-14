import { context, InvocationContext } from '../../middleware/invocation';
import { MySQLClient } from '../../clients/mysql-client';

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

  async getSOIDByIntegrationID(integrationID: string) {
    await this.connect();

    const [rows] = await this.connection.execute(`
      SELECT Organizations.SOID
      FROM Teams
      JOIN Organizations ON Teams.SOID = Organizations.SOID
      WHERE Teams.IntegrationID = "${integrationID}"
    `);

    this.connection.end();

    if (rows.length > 0) {
      return rows[0].SOID;
    } else {
      this.context.logger.error(`Failed to get SOID by ${integrationID}`);
    }
  }
}
