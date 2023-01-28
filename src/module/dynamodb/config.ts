import { DynamooseModuleOptions } from 'nestjs-dynamoose';

export const dynamodbConfig: DynamooseModuleOptions = {
  aws: {
    accessKeyId: process.env.DDB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY,
    region: process.env.DDB_REGION,
  },
  logger: true,
  local: false,
  table: {
    create: true,
    prefix: `${process.env.DDB_SERVICE}-${process.env.DDB_STAGE}-`,
    suffix: '-table',
  },
};
