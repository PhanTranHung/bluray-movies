#!/usr/bin/env node
import 'reflect-metadata';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { execSync } from 'child_process';

const CLI = 'ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli';
const BASE_PATH = `${__dirname}/src/module/relational-database`;
const DATA_SOURCE_PATH = `${BASE_PATH}/config-migration.ts`;
const MIGRATE_PATH = `${BASE_PATH}/migrations`;

const runCommand = (script: string) => {
  const logBuffer = execSync(script);
  console.log(logBuffer.toString());
};

class MigrationCreateCommand implements yargs.CommandModule {
  command = 'migration:create <file_name>';
  describe = 'Creates a new migration file.';

  async handler(args: yargs.Arguments) {
    try {
      runCommand(`${CLI} migration:create ${MIGRATE_PATH}/${args.file_name}`);
    } catch (err) {
      process.exit(1);
    }
  }
}

class MigrationGenerateCommand implements yargs.CommandModule {
  command = 'migration:generate <file_name>';
  describe = 'Generates a new migration file with sql needs to be executed to update schema.';

  async handler(args: yargs.Arguments) {
    try {
      runCommand(`${CLI} migration:generate ${MIGRATE_PATH}/${args.file_name} --pretty true --dataSource ${DATA_SOURCE_PATH}`);
    } catch (err) {
      process.exit(1);
    }
  }
}

class MigrationRunCommand implements yargs.CommandModule {
  command = 'migration:run';
  describe = 'Runs all pending migrations.';

  async handler(args: yargs.Arguments) {
    try {
      runCommand(`${CLI} migration:run --dataSource ${DATA_SOURCE_PATH}`);
    } catch (err) {
      process.exit(1);
    }
  }
}

class MigrationRevertCommand implements yargs.CommandModule {
  command = 'migration:revert';
  describe = 'Reverts last executed migration.';

  async handler(args: yargs.Arguments) {
    try {
      runCommand(`${CLI} migration:revert --dataSource ${DATA_SOURCE_PATH}`);
    } catch (err) {
      process.exit(1);
    }
  }
}

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command(new MigrationCreateCommand())
  .command(new MigrationGenerateCommand())
  .command(new MigrationRunCommand())
  .command(new MigrationRevertCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv;
