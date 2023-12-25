import { AppSyncClient } from '../../clients/appsync-client';
import { IIntegrationsRepository } from './types';

const GET_SOID_AND_INTEGRATIONID_BY_WEBHOOKID_QUERY = `
  query GetSOIDAndIntegrationIDByWebhookID($WebhookID: String) {
    getSOIDAndIntegrationIDByWebhookID(WebhookID: $WebhookID) {
      SOID
      IntegrationID
    }
  }
`;

export class GQLIntegrationsRepository implements IIntegrationsRepository {
  private client: AppSyncClient;

  constructor() {
    this.client = new AppSyncClient();
  }

  async getSOIDAndIntegrationIDByWebhookID(WebhookID: string) {
    const variables = {
      WebhookID,
    };

    const res = await this.client.request(GET_SOID_AND_INTEGRATIONID_BY_WEBHOOKID_QUERY, variables);

    return res.getSOIDAndIntegrationIDByWebhookID;
  }
}
