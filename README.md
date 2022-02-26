## mbx-cli

### Usage

```
cd APP_WORKSPACE_2022-01/app/
```

```
npx mbx-cli build
```

Executes `ant build...`, clones [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) to current app directory and installs npm packages.

To update [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) on the current app project, add `-u` option on the build command:

```
npx mbx-cli build -u
```

## Recommended workflow

1. Open up terminal run `mkdir APP_WORKSPACE_2022-01`
1. Open Eclipse IDE and choose the newly created `APP_WORKSPACE_2022-01` workspace.
1. Checkout app project.
1. Open again the terminal and run `cd APP_WORKSPACE_2022-01/app/`.
1. Run `npx mbx-cli build`.
1. Run the project Activity on Eclipse.

## Maintainer

Noel Earvin Piamonte
