## mbx-cli

CLI tool to manage [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) on a custom Ionic v1 project.

It is now compatible to both Git and CVS checked out projects.

> ICYMI, **_"mbx-gulp"_** is a custom Ionic v1 dot files and gulpfile to improve the developer experience.

## Usage

```sh
cd clonedProject/app/
```

or

```sh
cd WORKSPACE_2022-01/app/
```

then

```sh
npx mbx-cli build
```

The `build` command does the ff under the hood:

1. Automatically updates `sdk.dir` value to machine's `ANDROID_HOME` on `local.properties`
1. Executes `ant`
1. Removes `org.crosswalk.engine`
1. Clones [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp) and updates its dependencies (including `gulp-cli`)
1. Installs recommended VS Code [extension pack](https://github.com/earvinpiamonte/mbx-gulp#vs-code-extension-pack)

## Command definitions

| Command   | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| `build`   | Runs the `ant -f...` command with the `mbx-gulp`                               |
| `update`  | Updates the existing `mbx-gulp` to your app project                            |
| `install` | Installs the `mbx-gulp` to your app project                                    |
| `ant`     | Updates `local.properties` and does `ant -f...` command without the `mbx-gulp` |

## Recommended setup on project checkout with **Git**

1. Clone your project from remote
1. Open the terminal and `cd` to the local copy of your app project; e.g. `cd clonedProject/app/`
1. Run `npx mbx-cli build`
1. Import `platforms` from Android Studio (excluding crosswalk)
1. Add EMDK SDK as external lib
1. Run the app project Activity on Android Studio (to make sure the app works)

## Recommended setup on app project checkout with **CVS**

> NOTE: These instructions are exclusively for app projects checked out with CVS.

1. Create a new workspace on Eclipse IDE; e.g. `WORKSPACE_2022-01`.
1. Checkout app project
1. Open the terminal do `cd WORKSPACE_2022-01/app/`
1. Run `npx mbx-cli build`
1. Import `platforms` from Eclipse IDE (excluding crosswalk)
1. Add EMDK SDK as external lib
1. Run the app project Activity on Eclipse IDE (to make sure the app works)
1. Finally, initialize git to keep track on the changes. Open the app project on VS Code; click on the Source Control icon on the sidebar; click "Initialize Repository"

## Updating the `mbx-gulp`

To update the `mbx-gulp` on your app project:

> NOTE: Stop any currently running processes such as `gulp watch` and save (stash/ commit) your work first before running any `npx mbx-cli` commands.

```sh
cd clonedProject/app/
```

```sh
npx mbx-cli update
```

> Deprecation notice: `build -u` will still work but will be removed in the future. Please use `update` command as much as possible.

Head on to [mbx-gulp](https://github.com/earvinpiamonte/mbx-gulp#recomended-workflow) documentation for the recommended workflow after project checkout.

## Maintainer

Designed and developed by Noel Earvin Piamonte
