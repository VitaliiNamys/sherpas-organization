import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import errorLogger from '@middy/error-logger';
import { pino } from 'pino';
import { invocationMiddleware } from '@libs/middleware/invocation';
import { MySQLOrganizationRepository } from '@libs/dataleyer/organizations';

const logger = pino({
  base: undefined,
  timestamp: false,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

const GetOrganizationByIntegrationID = async (event) => {
  const { IntegrationID } = event;

  const organizationRepository = new MySQLOrganizationRepository();

  const organization = await organizationRepository.getOrganizationByIntegrationID(IntegrationID);

  return organization;
};

export const main = middy()
  .use(eventNormalizer())
  .use(errorLogger())
  .use(invocationMiddleware({ logger }))
  .handler(GetOrganizationByIntegrationID);
