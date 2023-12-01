import { createConnection, Connection } from 'mysql2/promise';
import { Signer } from '@aws-sdk/rds-signer';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

type ConnectionParams = {
  host: string;
  port: number;
  user: string;
  region: string;
  database: string;
};

export class MySQLClient {
  private readonly connectionParams: ConnectionParams;
  private signer: Signer;
  private db: Connection;

  constructor(params: ConnectionParams) {
    this.connectionParams = params;
  }

  async connect() {
    const { host, user, database, port, region } = this.connectionParams;
    const ca = 'src/us-east-1-bundle.pem';

    this.signer = new Signer({
      hostname: host,
      port,
      username: user,
      region: region,
    });

    await access(ca);

    this.db = await createConnection({
      host,
      user,
      database,
      authPlugins: {
        mysql_clear_password: () => () => this.signer.getAuthToken()
      },
      ssl: {
        rejectUnauthorized: false,
        ca: [await readFile(resolve(ca), 'utf-8')],
      }
    });

    return this.db;
  }
}