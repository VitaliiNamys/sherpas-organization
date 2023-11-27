import type { AWS } from '@serverless/typescript';

import GetSOIDbyWebhookID from '@functions/get-soid-by-webhook-id';

const serverlessConfiguration: AWS = {
  service: 'sherpas-organizations',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-plugin-scripts'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ORGANIZATION_INTEGRATION_TABLE: '',
      ORGANIZATIONS_DB_NAME: 'mysql',
      ORGANIZATIONS_PROXY_ENDPOINT: 'org-db-proxy.proxy-ck1dlrxuclxe.us-east-1.rds.amazonaws.com',
    },
  },
  // import the function via paths
  functions: { 
    ['testRds']: GetSOIDbyWebhookID,
  },
  package: { 
    individually: true,
    include: [
      'src/functions/get-soid-by-webhook-id/us-east-1-bundle.pem',
    ],
  },
  custom: {
    scripts: {
      hooks: {
        'deploy:finalize': './load-ca.sh',
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
