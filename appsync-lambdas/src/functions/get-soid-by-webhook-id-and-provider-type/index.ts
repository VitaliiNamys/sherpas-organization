import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 20,
  name: 'get-soid-by-webhook-id-and-provider-type',
  events: [],
};
