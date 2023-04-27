#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const [, , command, arg2] = process.argv;
const { ANDROID_HOME } = process.env;

const GULP_REPOSITORY = 'https://github.com/earvinpiamonte/mbx-gulp.git';

const BUILD_XML_FILE = 'build.xml';
const CROSSWALK_ENGINE_DIR = 'platforms/android/src/org/crosswalk/engine';
const ESLINT_JSON_FILE = '.eslintrc.json';
const GIT_DIR = '.git';
const GIT_IGNORE_FILE = '.gitignore';
const GULP_FILE = 'gulpfile.js';
const JS_CONFIG_FILE = 'jsconfig.json';
const LOCAL_PROPERTIES_FILE = 'local.properties';
const NODE_MODULES_DIR = 'node_modules';
const PACKAGE_JSON_FILE = 'package.json';
const PACKAGE_LOCK_JSON_FILE = 'package-lock.json';
const PRETTIER_IGNORE_FILE = '.prettierignore';
const README_FILE = 'README.md';
const TEMP_GIT_DIR = 'temp.git';
const VSCODE_DIR = '.vscode';

const ANT_BUILD_COMMAND = `ant -f ${BUILD_XML_FILE} copy-release`;
const CLONE_REPO_COMMAND = `git init && git remote add origin ${GULP_REPOSITORY} && git pull origin main`;
const NPM_INSTALL_COMMAND = 'npm i -g gulp-cli && npm i';
const DISCARD_LOCAL_PROPERTIES_COMMAND = `git reset HEAD ${LOCAL_PROPERTIES_FILE} && git checkout -- ${LOCAL_PROPERTIES_FILE}`;

const COMMON_FILES = [
  ESLINT_JSON_FILE,
  GIT_IGNORE_FILE,
  GULP_FILE,
  JS_CONFIG_FILE,
  NODE_MODULES_DIR,
  PACKAGE_JSON_FILE,
  PACKAGE_LOCK_JSON_FILE,
  PRETTIER_IGNORE_FILE,
  VSCODE_DIR,
];

const UPDATE_FLAG = '-u';

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
    const localPropertiesContents = fs.readFileSync(
      LOCAL_PROPERTIES_FILE,
      'utf-8'
    );

    const newLocalPropertiesContents = localPropertiesContents.replace(
      /sdk.dir=.*/,
      `sdk.dir=${ANDROID_HOME.split(path.sep).join(path.posix.sep)}`
    );

    fs.writeFileSync(LOCAL_PROPERTIES_FILE, newLocalPropertiesContents, 'utf8');

    console.log(`Success: Updated "local.properties".`);
  } catch (error) {
    console.log(`Error: Failed to update "local.properties".`);
  }
};

const _discardLocalProperties = () => {
  try {
    fs.existsSync(GIT_DIR) &&
      _run(DISCARD_LOCAL_PROPERTIES_COMMAND, {
        logOnStart: `Info: Discarding updates on "${LOCAL_PROPERTIES_FILE}"...`,
        logOnComplete: `Success: Updates on "${LOCAL_PROPERTIES_FILE}" discarded.`,
      });
  } catch (error) {
    console.log(`Error: Failed to discard "${LOCAL_PROPERTIES_FILE}".`);
  }
};

const _runAntBuild = () => {
  _run(ANT_BUILD_COMMAND, {
    logOnStart: `Info: ant copy-release started ...`,
    logOnComplete: `Success: ant copy-release complete".`,
  });
};

const _removeCrossWalk = () => {
  try {
    if (fs.existsSync(CROSSWALK_ENGINE_DIR)) {
      fs.rmSync(CROSSWALK_ENGINE_DIR, { force: true, recursive: true });
      console.log(`Success: Removed "${CROSSWALK_ENGINE_DIR}".`);
    }
  } catch (error) {
    console.log(`Error: Failed to remove "${CROSSWALK_ENGINE_DIR}".`, error);
  }
};

const _backupGit = () => {
  try {
    fs.rename(GIT_DIR, TEMP_GIT_DIR, (error) => {
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
    fs.rename(TEMP_GIT_DIR, GIT_DIR, (error) => {
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
  COMMON_FILES.forEach(
    (path) =>
      fs.existsSync(path) && fs.rmSync(path, { force: true, recursive: true })
  );

  return true;
};

const _reInstallPackages = () => {
  try {
    fs.existsSync(GULP_FILE) &&
      _removeCommonFiles() &&
      console.log('Success: Removed current "mbx-gulp".');
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  try {
    fs.existsSync(GIT_DIR) &&
      _backupGit() &&
      console.log('Success: Backup of project git repository saved.');
  } catch (error) {
    console.log('Error: Failed to backup project git repository.', error);
    return;
  }

  _run(CLONE_REPO_COMMAND);

  try {
    fs.rmSync(GIT_DIR, { force: true, recursive: true });
    console.log('Success: Removed "mbx-gulp" git repository.');
  } catch (error) {
    console.log('Error: Failed to cleanup "mbx-gulp" git repository.', error);
    return;
  }

  _run(NPM_INSTALL_COMMAND, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  try {
    if (fs.existsSync(README_FILE)) {
      fs.rmSync(README_FILE, { force: true, recursive: true });
      console.log(`Success: Removed "${README_FILE}".`);
    }
  } catch (error) {
    console.log(`Error: Failed to remove "${README_FILE}".`, error);
    return;
  }

  try {
    fs.existsSync(TEMP_GIT_DIR) &&
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
    if (fs.existsSync(PACKAGE_JSON_FILE)) {
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

  _runAntBuild();

  _removeCrossWalk();

  _discardLocalProperties();

  try {
    fs.existsSync(GULP_FILE) &&
      _removeCommonFiles() &&
      console.log('Success: Removed current "mbx-gulp".');
  } catch (error) {
    console.log('Error: Failed to locate files required.', error);
    return;
  }

  try {
    fs.existsSync(GIT_DIR) &&
      _backupGit() &&
      console.log('Success: Backup of project git repository saved.');
  } catch (error) {
    console.log('Error: Failed to backup project git repository.', error);
    return;
  }

  _run(CLONE_REPO_COMMAND);

  try {
    fs.rmSync(GIT_DIR, { force: true, recursive: true });
    console.log('Success: Removed "mbx-gulp" git repository.');
  } catch (error) {
    console.log('Error: Failed to cleanup "mbx-gulp" git repository.', error);
    return;
  }

  _run(NPM_INSTALL_COMMAND, {
    logOnStart: `Info: Installing npm packages ...`,
    logOnComplete: `Success: npm packages installed.`,
  });

  try {
    if (fs.existsSync(README_FILE)) {
      fs.rmSync(README_FILE, { force: true, recursive: true });
      console.log(`Success: Removed "${README_FILE}".`);
    }
  } catch (error) {
    console.log(`Error: Failed to remove "${README_FILE}".`, error);
    return;
  }

  try {
    fs.existsSync(TEMP_GIT_DIR) &&
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

const build = (option) => {
  try {
    if (!fs.existsSync(BUILD_XML_FILE)) {
      console.log(
        `Warning: Build command cannot run on this directory. Please make sure to "cd" on the project directory before running "build".`
      );

      return;
    }

    option == UPDATE_FLAG ? _reInstallPackages() : _freshInstallPackages();
  } catch (error) {
    console.log(`Error: Failed to execute "build" command.`, error);
  }
};

const update = () => {
  build(UPDATE_FLAG);
};

const ant = () => {
  try {
    if (!fs.existsSync(BUILD_XML_FILE)) {
      console.log(
        `Warning: ant command cannot run on this directory. Please make sure to "cd" on the project directory before running "ant".`
      );

      return;
    }

    _updateLocalProperties();
    _runAntBuild();
    _removeCrossWalk();
  } catch (error) {
    console.log(`Error: Failed to execute "ant" command.`, error);
  }
};

const install = () => {
  build(UPDATE_FLAG);
};

const commands = {
  init,
  build,
  update,
  ant,
  install,
};

_main(command, arg2);
