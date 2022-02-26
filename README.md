## mbx-cli

### Usage

Create a workspace folder, and clone [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) at `APP_WORKSPACE_NAME/app/`:

```
npx mbx-cli init APP_WORKSPACE_NAME
```

### Build project

Execute `ant build...` and install npm packages:

```
cd APP_WORKSPACE_NAME/app/
```

```
npx mbx-cli build
```

To update [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp), add `-u` option on the build command:

```
npx mbx-cli build -u
```

## Workflow

1. Open up terminal run `npx mbx-cli init APP_2022-05`
1. Open Eclipse IDE and choose the newly created `APP_2022-05` workspace.
1. Checkout app project.
1. Open again the terminal and run `cd APP_2022-05/app/`.
1. Run `npx mbx-cli build`.
1. Run the project Activity on Eclipse.

## Maintainer

Noel Earvin Piamonte
