## mbx-cli

### Usage

```
cd APP_WORKSPACE_2022-01/app/
```

```
npx mbx-cli build
```

The command updates `sdk.dir` to `$ANDROID_HOME` on `local.properties`, executes `ant build ...`, clones [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) to the current app directory and installs npm packages.

## Recommended workflow

1. Open up terminal run `mkdir APP_WORKSPACE_2022-01`
1. Open Eclipse IDE and choose the newly created `APP_WORKSPACE_2022-01` workspace.
1. Checkout app project.
1. Open again the terminal and run `cd APP_WORKSPACE_2022-01/app/`.
1. Run `npx mbx-cli build`.
1. Run the project Activity on Eclipse.

## Update `mbx-gulp`

To update [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) on the current app project, add `-u` option on the build command:

```
npx mbx-cli build -u
```

## Maintainer

Noel Earvin Piamonte
