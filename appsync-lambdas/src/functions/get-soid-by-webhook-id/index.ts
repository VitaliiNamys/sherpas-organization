import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'get-soid-by-webhook-id',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
