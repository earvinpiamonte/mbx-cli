#!/usr/bin/env node

import * as readline from 'node:readline';
import fs from 'fs';
import { execSync } from 'child_process';
import { stdin as input, stdout as output } from 'node:process';

const [, , command, arg2] = process.argv;
const { ANDROID_HOME } = process.env;

const buildXml = './build.xml';
const gulpRepository = '/var/www/html/mbx-gulp'; // TO DO: replace with https://github.com/earvinpiamonte/mbx-gulp.git
const localProperties = './local.properties';
const packageJson = './package.json';
const platforms = './platforms';

const antBuildCommand = `echo "ant build -f build.xml"`; // TO DO
const cleanUpCommand = `rm -rf node_modules/ && rm -rf .git/ && rm -rf .vscode/ && rm package.json package-lock.json .eslintrc.json gulpfile.js .gitignore`;
const cloneRepoCommand = `git init && git remote add origin ${gulpRepository} && git pull origin main && rm -rf .git/`;
const npmInstallCommand = 'npm i';
const removeCrosswalkCommand = `rm -rf ./platforms/android/src/org/crosswalk/engine/`;

const _main = (command, arg2 = null) => {
  if (commands[command]) {
    commands[command](arg2);
    return;
  }

  console.log(`Error: Invalid command "${command}"`);
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
  try {
    if (fs.existsSync(packageJson)) {
      _run(cleanUpCommand, {
        logOnStart: `Info: Cleaning up common files ...`,
        logOnComplete: `Success: Cleanup complete.`,
      });
    }
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  _run(cloneRepoCommand);

  _run(npmInstallCommand, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  _run(`rm README.md`);

  console.log('Success: Update common files complete.');
};

const _freshInstallPackages = () => {
  try {
    if (fs.existsSync(platforms)) {
      console.log(
        'Warning: Cannot fresh install packages. Please run "build -u" to update common files.'
      );
      return;
    }
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  _updateLocalProperties();

  _run(antBuildCommand, {
    logOnStart: `Info: ant build started ...`,
    logOnComplete: `Success: ant build complete".`,
  });

  _run(removeCrosswalkCommand, {
    logOnStart: `Info: Removing "org.crosswalk.engine" ...`,
    logOnComplete: `Success: "org.crosswalk.engine" has been removed.`,
  });

  _run(cloneRepoCommand, {
    logOnStart: `Info: Cloning project ...`,
    logOnComplete:
      'Success: Workspace is now ready! Open Eclipse and checkout a project.',
  });

  _run(npmInstallCommand, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  _run(`rm README.md`);

  console.log('Success: Build complete.');
};

const init = (workspace) => {
  if (workspace) {
    _run(`mkdir -p ${workspace}`, {
      logOnComplete: 'Success: Workspace created!',
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
    prompt.question(
      `The "build" command will remove the current instance of git on this project.\nProceed? y/n\n`,
      (answer) => {
        const answerLowerCase = answer.toLowerCase();

        if (answerLowerCase == 'y' || answerLowerCase == 'yes') {
          option == update ? _reInstallPackages() : _freshInstallPackages();
        }
        prompt.close();
      }
    );
  } catch (error) {
    console.log(`Error: Failed to execute "build" command.`, error);
  }
};

const commands = {
  init,
  build,
};

_main(command, arg2);
