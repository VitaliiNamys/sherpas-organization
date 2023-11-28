import type { AWS } from '@serverless/typescript';

import GetSOIDbyIntegrationID from '@functions/get-soid-by-integration-id';

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
      ORGANIZATIONS_DB_NAME: 'organizations',
      ORGANIZATIONS_PROXY_ENDPOINT: 'org-db-proxy.proxy-cxzpplvqefyn.us-east-1.rds.amazonaws.com',
    },
  },
  // import the function via paths
  functions: { 
    ['get-soid-by-integration-id']: GetSOIDbyIntegrationID,
  },
  package: { 
    individually: true,
    include: [
      'src/us-east-1-bundle.pem',
    ],
  },
  custom: {
    patterns: [
      'src/us-east-1-bundle.pem',
    ],
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
