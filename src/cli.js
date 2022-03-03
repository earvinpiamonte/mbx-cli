#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

const [, , command, arg2] = process.argv;
const { ANDROID_HOME } = process.env;

const gulpRepository = 'https://github.com/earvinpiamonte/mbx-gulp.git';

const buildXml = 'build.xml';
const crosswalkEngine = 'platforms/android/src/org/crosswalk/engine';
const eslintJson = '.eslintrc.json';
const git = '.git';
const gitIgnore = '.gitignore';
const gulpFile = 'gulpfile.js';
const localProperties = 'local.properties';
const nodeModules = 'node_modules';
const packageJson = 'package.json';
const packageLockJson = 'package-lock.json';
const prettierIgnore = '.prettierignore';
const readme = 'README.md';
const tempGit = 'temp.git';
const vsCode = '.vscode';

const antBuildCommand = `ant -f ${buildXml} copy-release`;
const cloneRepoCommand = `git init && git remote add origin ${gulpRepository} && git pull origin main`;
const npmInstallCommand = 'npm install --global gulp-cli && npm i';

const commonFiles = [
  eslintJson,
  gitIgnore,
  gulpFile,
  nodeModules,
  packageJson,
  packageLockJson,
  prettierIgnore,
  vsCode,
];

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

const _backupGit = () => {
  try {
    fs.rename(git, tempGit, (error) => {
      error &&
        console.log('Error: Failed to backup current Git repository.', error);
      return false;
    });
  } catch (error) {
    console.log('Error: Failed to backup current Git repository.', error);
    return false;
  }

  return true;
};

const _restoreGit = () => {
  try {
    fs.rename(tempGit, git, (error) => {
      error &&
        console.log('Error: Failed to restore current Git repository.', error);
      return false;
    });
  } catch (error) {
    console.log('Error: Failed to restore Git repository.', error);
    return false;
  }

  return true;
};

const _removeCommonFiles = () => {
  commonFiles.forEach(
    (path) =>
      fs.existsSync(path) && fs.rmSync(path, { force: true, recursive: true })
  );

  return true;
};

const _reInstallPackages = () => {
  try {
    fs.existsSync(gulpFile) &&
      _removeCommonFiles() &&
      console.log('Success: Removed current "mbx-gulp".');
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  try {
    fs.existsSync(git) &&
      _backupGit() &&
      console.log('Success: Backup of project git repository saved.');
  } catch (error) {
    console.log('Error: Failed to backup project git repository.', error);
    return;
  }

  _run(cloneRepoCommand);

  try {
    fs.rmSync(git, { force: true, recursive: true });
    console.log('Success: Removed "mbx-gulp" git repository.');
  } catch (error) {
    console.log('Error: Failed to cleanup "mbx-gulp" git repository.', error);
    return;
  }

  _run(npmInstallCommand, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  try {
    if (fs.existsSync(readme)) {
      fs.rmSync(readme, { force: true, recursive: true });
      console.log(`Success: Removed "${readme}".`);
    }
  } catch (error) {
    console.log(`Error: Failed to remove "${readme}".`, error);
    return;
  }

  try {
    fs.existsSync(tempGit) &&
      _restoreGit() &&
      console.log('Success: Restored project git repository.');
  } catch (error) {
    console.log('Error: Failed to restore project git repository.', error);
    return;
  }

  console.log('Success: Update "mbx-gulp" complete.');
};

const _freshInstallPackages = () => {
  try {
    if (fs.existsSync(packageJson)) {
      console.log(
        'Warning: Cannot build/ fresh install packages. Please run "build -u" to update "mbx-gulp".'
      );
      return;
    }
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  _updateLocalProperties();

  _run(antBuildCommand, {
    logOnStart: `Info: ant copy-release started ...`,
    logOnComplete: `Success: ant copy-release complete".`,
  });

  try {
    if (fs.existsSync(crosswalkEngine)) {
      fs.rmSync(crosswalkEngine, { force: true, recursive: true });
      console.log(`Success: Removed "${crosswalkEngine}".`);
    }
  } catch (error) {
    console.log(`Error: Failed to remove "${crosswalkEngine}".`, error);
    return;
  }

  try {
    fs.existsSync(gulpFile) &&
      _removeCommonFiles() &&
      console.log('Success: Removed current "mbx-gulp".');
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  try {
    fs.existsSync(git) &&
      _backupGit() &&
      console.log('Success: Backup of project git repository saved.');
  } catch (error) {
    console.log('Error: Failed to backup project git repository.', error);
    return;
  }

  _run(cloneRepoCommand);

  try {
    fs.rmSync(git, { force: true, recursive: true });
    console.log('Success: Removed "mbx-gulp" git repository.');
  } catch (error) {
    console.log('Error: Failed to cleanup "mbx-gulp" git repository.', error);
    return;
  }

  _run(npmInstallCommand, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  try {
    if (fs.existsSync(readme)) {
      fs.rmSync(readme, { force: true, recursive: true });
      console.log(`Success: Removed "${readme}".`);
    }
  } catch (error) {
    console.log(`Error: Failed to remove "${readme}".`, error);
    return;
  }

  try {
    fs.existsSync(tempGit) &&
      _restoreGit() &&
      console.log('Success: Restored project git repository.');
  } catch (error) {
    console.log('Error: Failed to restore project git repository.', error);
    return;
  }

  console.log('Success: Build complete.');
};

const init = (workspace) => {
  if (workspace) {
    fs.mkdir(workspace, { recursive: true }, (error) => {
      if (error) {
        console.log('Error: Failed to create workspace directory.');
        return;
      }

      console.log('Success: Workspace created!');
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
