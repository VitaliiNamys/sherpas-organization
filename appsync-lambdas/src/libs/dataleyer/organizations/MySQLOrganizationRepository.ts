import { context, InvocationContext } from '../../middleware/invocation';
import { MySQLClient } from '../../clients/mysql-client';
import { IOrganizationRepository } from './types';

export class MySQLOrganizationRepository implements IOrganizationRepository {
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

  // TODO: {VitaliiNamys} Double check DB query once issue with DB connection will be fixed
  async getOrganizationByIntegrationID(integrationID: string) {
    try {
      await this.connect();

      const [rows] = await this.connection.execute(`
        SELECT *
        FROM Organizations o
        INNER JOIN Teams t ON o.SOID = t.SOID
        WHERE t.IntegrationID = "${integrationID}"
      `);

      this.connection.end();

      if (rows.length > 0) {
        return rows[0];
      } else {
        this.context.logger.error(`There is no Organization by ${integrationID}`);

        return null;
      }
    } catch (error) {
      this.context.logger.error(`Failed to query Organization by ${integrationID}. Error: ${error}`);

      throw error;
    }


  }
}
