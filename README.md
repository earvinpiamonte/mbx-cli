## mbx-cli

### Create a workspace folder

```
npx mbx-cli init APP_WORKSPACE_NAME
```

Clones project common files at `APP_WORKSPACE_NAME/app/`.

### Build project

```
cd APP_WORKSPACE_NAME/app/
```

```
npx mbx-cli build
```

Executes `ant build...` and installs npm packages.

To update the common files such as `package.json`, `.eslintrc.json`, add `-u` option on the build command.

```
npx mbx-cli build -u
```

## Maintainer

Noel Earvin Piamonte
