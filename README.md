# Typescript Starter

A helper repository to get small typescript repositories up quickly, including:

- tsconfig.json
- eslint
- package.json scripts
- vscode debugger
- .editorconfig

# Installing common dependencies
The following dev dependencies are already listed in the package.json.

```
npm install --save-dev \
    @eslint/js \
    @types/eslint__js \
    @types/node \
    eslint \
    typescript \
    typescript-eslint
```

Common non-dev dependencies used that are not included in package.json:
```
npm install --save fs commander winston
```


## References to common usage:

Some code snippets for very commononly used code.

##### Commander

```
// src/bin/console.ts
import {Command} from 'commander';
import * as commands from '../command/index';

const program = (new Command())
  .description('My description for my command line tool')
  .version('0.0.1');

[].forEach((cmd: Command) => program.addCommand(cmd));

program.addHelpCommand();
program.parse();
```



