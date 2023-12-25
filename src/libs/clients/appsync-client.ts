import { AppSyncClient as AppSyncClientCore } from '@aws-sdk/client-appsync';
import AppsyncClient from 'appsync-client';
import gql from 'graphql-tag';
import { InvocationContext, context } from '../middleware/invocation';

export class AppSyncClient {
  private coreClient: AppSyncClientCore; // We will need this client for fetching GraphqQL schema
  private client: AppsyncClient;

  private context: InvocationContext;

  constructor() {
    this.context = context<{ logger }>();

    const apiUrl = process.env.APP_SYNC_ENDPOINT;
    const region = process.env.REGION;

    this.coreClient = new AppSyncClientCore({
      region,
    });

    this.client = new AppsyncClient({
      apiUrl,
    });
  }

  async request(query: string, variables: object) {
    this.context.logger.debug({ query, variables }, 'GraphQL request data');

    try {
      const result = await this.client.request({
        query: gql(query),
        variables,
      });

      return result;
    } catch (error) {
      this.context.logger.error(error, 'Something went wrong on request to AppSync GraphQL API');

      throw error;
    }
  }
}
