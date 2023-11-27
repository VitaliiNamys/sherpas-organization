import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import cloudwatchMetrics, { Context } from '@middy/cloudwatch-metrics';
import errorLogger from '@middy/error-logger';
import { invocationMiddleware } from '../../libs/invocation';
import { pino } from 'pino';

import { MySQLOrganizationRepository, DDBOrganizationRepository } from '../../dataleyer/repositories/organizations';

const GetSOIDbyWebhookIDandProviderType = async (event, context: Context) => {
  const { WebhookID, ProviderType } = event;
  const mysqRepository = new MySQLOrganizationRepository();
  const ddbRepository = new DDBOrganizationRepository();
  
  const integrationId = await ddbRepository.getIntegrationIDByWebhookIDandProviderType(WebhookID, ProviderType);
  const SOID = await mysqRepository.getSOIDByIntegrationID(integrationId);

  context.metrics.setProperty('RequestId', context.awsRequestId);

  return {
    statusCode: 200,
    body: {
      SOID,
    }
  };
};

const logger = pino();

export const main = middy()
  .use(eventNormalizer())
  .use(errorLogger())
  .use(
    cloudwatchMetrics({
      namespace: process.env.LAMBDA_NAME,
      dimensions: [{ Action: 'GetSOIDByWebhookID' }],
    }),
  )
  .use(invocationMiddleware({ logger }))
  .handler(GetSOIDbyWebhookIDandProviderType);
