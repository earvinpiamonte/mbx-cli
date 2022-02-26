#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const [, , command, arg2] = process.argv;
const { ANDROID_HOME } = process.env;

const buildXml = './build.xml';
const localProperties = './local.properties';
const gulpRepository = '/var/www/html/mbx-gulp'; // TO DO: replace with https://github.com/earvinpiamonte/mbx-gulp.git

const cloneRepoCommand = `git init && git remote add origin ${gulpRepository} && git pull origin main && rm -rf .git/`;
const cleanUpCommand = `rm -rf node_modules/ && rm -rf .git/ && rm -rf .vscode/ && rm package.json package-lock.json .eslintrc.json gulpfile.js .gitignore`;
const npmInstallCommand = 'npm i';
const removeCrosswalkCommand = `rm -rf ./platforms/android/src/org/crosswalk/engine/`;
const antBuildCommand = `echo "ant build -f build.xml"`; // TO DO

const _main = (command, arg2 = null) => {
  if (commands[command]) {
    commands[command](arg2);
    return;
  }

  console.log(`Error: Invalid command "${command}."`);
};

const _run = (command, options = {}) => {
  const { logOnStart = '', logOnComplete = '' } = options;

  try {
    logOnStart && console.log(logOnStart);
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (error) {
    console.log(`Error: Failed to execute command "${command}".`, error);
    return false;
  }

  logOnComplete && console.log(logOnComplete);
  return true;
};

const _updateLocalProperties = () => {
  console.log(`Info: Updating "local.properties" ...`);

  try {
    const localPropertiesContents = fs.readFileSync(localProperties, 'utf-8');

    const newLocalPropertiesContents = localPropertiesContents.replace(
      /sdk.dir=.*/,
      `sdk.dir=${ANDROID_HOME}`
    );

    fs.writeFileSync(localProperties, newLocalPropertiesContents, 'utf8');

    console.log(`Success: Updated "local.properties".`);
  } catch (error) {
    console.log(`Error: Failed to update "local.properties".`);
  }
};

const _reInstallPackages = () => {
  _run(cleanUpCommand, {
    logOnStart: `Info: Cleaning up common files ...`,
    logOnComplete: `Success: Cleanup complete.`,
  });

  _run(`git init && ${cloneRepoCommand}`);

  _run(npmInstallCommand, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  console.log('Success: Update common files complete.');
};

const _freshInstallPackages = () => {
  _updateLocalProperties();

  _run(antBuildCommand, {
    logOnStart: `Info: ant build started ...`,
    logOnComplete: `Success: ant build complete".`,
  });

  _run(removeCrosswalkCommand, {
    logOnStart: `Info: Removing "org.crosswalk.engine" ...`,
    logOnComplete: `Success: "org.crosswalk.engine" has been removed.`,
  });

  _run(npmInstallCommand, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  console.log('Succes: Build complete.');
};

const init = (workspace) => {
  if (workspace) {
    const [workspaceProject] = workspace.split('_');
    const newDirectory = `${workspace}/${workspaceProject.toLowerCase()}`;

    _run(`mkdir -p ${newDirectory}`, {
      logOnStart: `Info: Creating workspace "${newDirectory}" ...`,
      logOnComplete: 'Success: Workspace created!',
    });

    _run(`cd ${newDirectory} && git init && ${cloneRepoCommand}`, {
      logOnStart: `Info: Cloning project ...`,
      logOnComplete:
        'Success: Workspace is now ready! Open Eclipse and checkout a project.',
    });

    return;
  }

  console.log('Error: Please specify a workspace.');
};

const build = async (option) => {
  const update = '-u';

  try {
    if (!fs.existsSync(buildXml)) {
      console.log(
        `Warning: Build command cannot run on this directory. Please make sure to "cd" on the project directory before running "build".`
      );

      return;
    }

    if (!fs.existsSync('.git/')) {
      option == update ? _reInstallPackages() : _freshInstallPackages();
      return;
    }

    const prompt = readline.createInterface({ input, output });
    const answer = await prompt.question(
      `The "build" command will remove the current instance of git on this project.\nProceed? y/n\n`
    );
    const answerLowerCase = answer.toLowerCase();

    if (answerLowerCase == 'y' || answerLowerCase == 'yes') {
      option == update ? _reInstallPackages() : _freshInstallPackages();
    }

    prompt.close();
  } catch (error) {
    console.log(`Error: Failed to execute "build" command.`, error);
  }
};

const commands = {
  init,
  build,
};

_main(command, arg2);
