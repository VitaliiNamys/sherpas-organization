import {
  DynamoDB,
  DynamoDBClientConfig,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { InvocationContext, context } from '../middleware/invocation';

export class DynamoDBClient {
  private client: DynamoDB;
  private configs: DynamoDBClientConfig;

  private context: InvocationContext;

  constructor(configs: DynamoDBClientConfig) {
    this.configs = configs;

    this.client = this.getInstance();
  }

  private getInstance(): DynamoDB {
    this.context = context();

    if (!this.client) {
      this.client = new DynamoDB(this.configs);
    }

    return this.client;
  }

  async putItem(query: PutItemCommandInput): Promise<PutItemCommandOutput> {
    const putItemCommand = new PutItemCommand(query);

    try {
      return this.getInstance().send(putItemCommand);
    } catch (error) {
      this.context.loggerStore.add({
        error,
        errorMessage: 'Something went wrong during DynamoDB request',
      });

      throw error;
    }
  }

  async getItem(query: GetItemCommandInput): Promise<GetItemCommandOutput> {
    const getItemCommand = new GetItemCommand(query);

    try {
      return this.getInstance().send(getItemCommand);
    } catch (error) {
      this.context.loggerStore.add({
        error,
        errorMessage: 'Something went wrong during DynamoDB request',
      });

      throw error;
    }
  }
}
