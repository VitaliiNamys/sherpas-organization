import { handlerPath } from '@libs/system/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 20,
  name: 'get-soid-by-integration-id',
  events: [],
};
