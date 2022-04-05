## mbx-cli

CLI tool to add [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) preset/ configs on a custom Ionic v1 project (CLI helper tool).

## Usage

```sh
cd APP_WORKSPACE_2022-01/app/
```

```sh
npx mbx-cli build
```

The `build` command does the ff under the hood:

1. Updates `sdk.dir` value to `ANDROID_HOME` on `local.properties`
1. Executes `ant`
1. Removes `org.crosswalk.engine`
1. Clones [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) template and updates its dependencies (includes: `gulp-cli`, `eslint`)
1. Installs ESLint VS Code extension

## Recommended setup on project checkout

1. Open up terminal run `mkdir APP_WORKSPACE_2022-01`
1. Open Eclipse IDE and choose the newly created `APP_WORKSPACE_2022-01` workspace.
1. Checkout app project
1. Open the terminal once again and do `cd APP_WORKSPACE_2022-01/app/`
1. Run `npx mbx-cli build`
1. Run the project Activity on Eclipse IDE (to make sure the app works)
1. Finally, initialize git to keep track on the changes. Open the app project on VS Code; click on the Source Control icon on the sidebar; click "Initialize Repository"
1. Head on to [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp#recomended-workflow) documentation for the recommended workflow after project checkout

## Update or add `mbx-gulp` template

To update or add [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) on your current app project:

> NOTE: Stop any currently running processes such as gulp watch before running any `npx mbx-cli` commands.

```sh
cd APP_WORKSPACE_2022-01/app/
```

```sh
npx mbx-cli update
```

> Deprecation notice: `build -u` will still work but will be removed in the future. Please use `update` as much as possible.

## Maintainer

Noel Earvin Piamonte
