import type { KinesisStreamEvent, ALBEvent } from 'aws-lambda';

export type Event = KinesisStreamEvent | ALBEvent;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InvocationContext = any;

export type Request = {
  event: Event; // TODO: Add other event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
};

let evt, ctx;

export const event = (): Event => {
  return evt;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const context = <T>(): any & T => {
  return ctx;
};

export const invocationMiddleware = (opts = {}) => {
  const invocationMiddlewareBefore = async (request: Request) => {
    evt = request.event;
    ctx = {
      functionVersion: request.context.functionVersion,
      functionName: request.context.functionName,
      memoryLimitInMB: request.context.memoryLimitInMB,
      logGroupName: request.context.logGroupName,
      logStreamName: request.context.logStreamName,
      clientContext: request.context.clientContext,
      identity: request.context.identity,
      invokedFunctionArn: request.context.invokedFunctionArn,
      awsRequestId: request.context.awsRequestId,
      getRemainingTimeInMillis: request.context.getRemainingTimeInMillis,
      metrics: request.context.metrics,
      ...opts,
    };
  };

  const invocationMiddlewareAfter = async () => {
    evt = null;
    ctx = null;
  };

  const invocationMiddlewareOnError = async () => {
    evt = null;
    ctx = null;
  };

  return {
    before: invocationMiddlewareBefore,
    after: invocationMiddlewareAfter,
    onError: invocationMiddlewareOnError,
  };
};
