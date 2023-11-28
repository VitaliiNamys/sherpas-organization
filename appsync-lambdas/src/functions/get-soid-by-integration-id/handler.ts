import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import cloudwatchMetrics, { Context } from '@middy/cloudwatch-metrics';
import errorLogger from '@middy/error-logger';
import { invocationMiddleware } from '../../libs/invocation';
import { pino } from 'pino';

import { MySQLOrganizationRepository } from '../../dataleyer/repositories/organizations';

const GetSOIDbyIntegrationID = async (event, context: Context) => {
  const { IntegrationId } = event;
  const mysqRepository = new MySQLOrganizationRepository();
  const SOID = await mysqRepository.getSOIDByIntegrationID(IntegrationId);
  
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
      dimensions: [{ Action: 'GetSOIDbyIntegrationID' }],
    }),
  )
  .use(invocationMiddleware({ logger }))
  .handler(GetSOIDbyIntegrationID);
