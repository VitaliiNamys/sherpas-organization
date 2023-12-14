import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import errorLogger from '@middy/error-logger';
import { invocationMiddleware } from '../../libs/middleware/invocation';
import { pino } from 'pino';

import { MySQLOrganizationRepository } from '../../libs/dataleyer/organizations';

const logger = pino({
  base: undefined,
  timestamp: false,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

const GetSOIDbyIntegrationID = async (event) => {
  const { IntegrationID } = event;
  const mysqRepository = new MySQLOrganizationRepository();

  const SOID = await mysqRepository.getSOIDByIntegrationID(IntegrationID);

  return SOID;
};

export const main = middy()
  .use(eventNormalizer())
  .use(errorLogger())
  .use(invocationMiddleware({ logger }))
  .handler(GetSOIDbyIntegrationID);
