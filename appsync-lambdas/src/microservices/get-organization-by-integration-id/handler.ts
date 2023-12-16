import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import errorLogger from '@middy/error-logger';
import { pino } from 'pino';
import { MySQLOrganizationRepositoryMock } from '@libs/dataleyer/organizations/MySQLOrganizationRepositoryMock';
import { invocationMiddleware } from '@libs/middleware/invocation';

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
  const mysqRepository = new MySQLOrganizationRepositoryMock();

  const organization = await mysqRepository.getOrganizationByIntegrationID(IntegrationID);

  return organization;
};

export const main = middy()
  .use(eventNormalizer())
  .use(errorLogger())
  .use(invocationMiddleware({ logger }))
  .handler(GetOrganizationByIntegrationID);
