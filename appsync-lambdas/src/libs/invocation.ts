import type { KinesisStreamEvent, ALBEvent } from 'aws-lambda';
import type { Context } from '@middy/cloudwatch-metrics';

export type Event = KinesisStreamEvent | ALBEvent;
export type InvocationContext<T> = Context & T;

export type Request = {
  event: Event; // TODO: Add other event
  context: Context;
};

let evt, ctx;

export const event = (): Event => {
  return evt;
};

export const context = <T>(): Context & T => {
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
