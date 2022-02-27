#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

const [, , command, arg2] = process.argv;
const { ANDROID_HOME } = process.env;

const buildXml = './build.xml';
const git = './.git';
const gulpRepository = '/var/www/html/mbx-gulp'; // TO DO: replace with https://github.com/earvinpiamonte/mbx-gulp.git
const localProperties = './local.properties';
const packageJson = './package.json';
const platforms = './platforms';
const tempGit = './temp.git';

const antBuildCommand = `echo "ant build -f build.xml"`; // TO DO
const cleanUpCommand = `rm -rf node_modules/ && rm -rf .vscode/ && rm package.json package-lock.json .eslintrc.json gulpfile.js .gitignore`;
const cloneRepoCommand = `git init && git remote add origin ${gulpRepository} && git pull origin main && rm -rf .git`;
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

const backupGit = () => {
  try {
    fs.rename(git, tempGit, (error) => {
      error &&
        console.log('Error: Failed to backup current git instance.', error);
      return false;
    });
  } catch (error) {
    console.log('Error: Failed to backup current git instance.', error);
    return false;
  }

  return true;
};

const restoreGit = () => {
  try {
    fs.rename(tempGit, git, (error) => {
      error &&
        console.log('Error: Failed to backup current git instance.', error);
      return false;
    });
  } catch (error) {
    console.log('Error: Failed to restore git instance.', error);
    return false;
  }

  return true;
};

const _reInstallPackages = () => {
  try {
    if (!fs.existsSync(platforms)) {
      console.log(
        'Warning: Cannot re-install install packages. Please run "build" without "-u" option.'
      );
      return;
    }
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

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

  try {
    fs.existsSync(git) && backupGit();
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

  try {
    fs.existsSync(tempGit) && restoreGit();
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  console.log('Success: Update common files complete.');
};

const _freshInstallPackages = () => {
  try {
    if (fs.existsSync(platforms) || fs.existsSync(packageJson)) {
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

  try {
    fs.existsSync(git) && backupGit();
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

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

  try {
    fs.existsSync(tempGit) && restoreGit();
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

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

    option == update ? _reInstallPackages() : _freshInstallPackages();
  } catch (error) {
    console.log(`Error: Failed to execute "build" command.`, error);
  }
};

const commands = {
  init,
  build,
};

_main(command, arg2);
