## mbx-cli

CLI tool to add [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) on a custom Ionic v1 project (CLI helper tool).

## Usage

```sh
cd APP_WORKSPACE_2022-01/app/
```

```sh
npx mbx-cli build
```

The `build` command does the ff under the hood:

1. Automaticall updates `sdk.dir` value to machine's `ANDROID_HOME` on `local.properties`
1. Executes `ant`
1. Removes `org.crosswalk.engine`
1. Clones [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) and updates its dependencies (including `gulp-cli`)
1. Installs VS Code [extension pack](https://github.com/earvinpiamonte/mbx-gulp#vs-code-extension-pack)

## Command definitions

- `build` - the `ant -f...` command with the [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp); run this after app project checkout.
- `update` - updates existing [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) to app project; run this to get an updated [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) to project.
- `install` - installs [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) to app project.
- `ant` - updated `local.properties` and does `ant -f...` command without the [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp).

## Recommended setup on project checkout

1. Open up terminal run `mkdir APP_WORKSPACE_2022-01`
1. Open Eclipse IDE and choose the newly created `APP_WORKSPACE_2022-01` workspace.
1. Checkout app project
1. Open the terminal once again and do `cd APP_WORKSPACE_2022-01/app/`
1. Run `npx mbx-cli build`
1. Import `platforms` from Eclipse IDE
1. Add EMDK as external lib
1. Run the project Activity on Eclipse IDE (to make sure the app works)
1. Finally, initialize git to keep track on the changes. Open the app project on VS Code; click on the Source Control icon on the sidebar; click "Initialize Repository"

Head on to [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp#recomended-workflow) documentation for the recommended workflow after project checkout

## Update `mbx-gulp` template

To update [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) on your current app project:

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
