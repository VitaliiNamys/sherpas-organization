import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { context, InvocationContext } from '../../middleware/invocation';
import { DynamoDBClient } from '@libs/client/dynamodb-client';
import type { IIntegrationsRepository } from './types';

export class DDBIntegrationRepository implements IIntegrationsRepository {
  private context: InvocationContext;
  private readonly dynamoDBClient: DynamoDBClient;

  constructor() {
    this.context = context<{ logger }>();
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    });
  }

  async getIntegrationIDByWebhookID(WebhookID: string) {
    try {
      const res = await this.dynamoDBClient.getItem({
        Key: marshall({
          partition_key: `WEBHOOKID#${WebhookID}`,
        }),
        TableName: process.env.INTEGRATIONS_TABLE,
      });

      return res?.Item ? unmarshall(res.Item).IntegrationID : null;
    } catch (error) {
      this.context.logger.error(`Failed to get IntegrationID by WebhookID ${WebhookID} from DDB: ${error}`);

      return null;
    }
  }
}
