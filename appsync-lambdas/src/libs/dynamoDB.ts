import {
  DynamoDB,
  DynamoDBClientConfig,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput
} from '@aws-sdk/client-dynamodb';

export class DynamoDBClient {
  private client: DynamoDB;
  private configs: DynamoDBClientConfig;

  constructor(configs: DynamoDBClientConfig) {
    this.configs = configs;

    this.client = this.getInstance();
  }

  private getInstance(): DynamoDB {
    if (!this.client) {
      this.client = new DynamoDB(this.configs);
    }

    return this.client;
  }

  async putItem(query: PutItemCommandInput): Promise<PutItemCommandOutput> {
    const putItemCommand = new PutItemCommand(query);

    return this.getInstance().send(putItemCommand);
  }

  async getItem(query: GetItemCommandInput): Promise<GetItemCommandOutput> {
    const getItemInputCommand = new GetItemCommand(query);

    return this.getInstance().send(getItemInputCommand);
  }
}
