import { context, InvocationContext } from '../../../libs/invocation';
import { DynamoDBClient } from '../../../libs/dynamoDB';

export class DDBOrganizationRepository {
  private readonly dynamoDBClient: DynamoDBClient;
  private context: InvocationContext<{ logger }>;

  constructor() {
    this.context = context<{ logger }>();
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    });
  }

  async getIntegrationIDByWebhookID(webhookID: string) {
    try {
      const data = await this.dynamoDBClient.getItem({
        TableName: process.env.ORGANIZATION_INTEGRATION_TABLE,
        KeyConditionExpression: 'Integrations.VCS.GitHub[*].Webhooks[*].ID = :webhookId',
        ExpressionAttributeValues: {
          ':webhookId': webhookID,
        },
        ProjectionExpression: 'Integrations.VCS.GitHub[*].IntegrationID',
      } as any);

      return data.Item;
    } catch(error) {
      console.log(error);
      // TODO: add logging
    }
  }

  async getIntegrationIDByWebhookIDandProviderType(webhookID: string, ProviderType: string) {
    
  }
}
