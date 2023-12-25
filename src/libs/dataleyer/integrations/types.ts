type GetSOIDAndIntegrationIDByWebhookIDResponse = {
  SOID: string;
  IntegrationID: string;
};

export interface IIntegrationsRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIntegrationIDByWebhookID?(WebhookID: string): Promise<any>;
  getSOIDAndIntegrationIDByWebhookID?(WebhookID: string): Promise<GetSOIDAndIntegrationIDByWebhookIDResponse>;
}
