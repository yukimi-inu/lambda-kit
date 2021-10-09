#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const {execSync} = require('child_process');

const argv = yargs
  .option('function-name', {
    alias: 'n',
    description: 'function name',
    demandOption: true
  })
  .option('entry', {
    alias: 'e',
    description: 'Entry script',
    demandOption: true
  })
  .option('outfile', {
    alias: 'o',
    description: 'Output script',
    demandOption: true
  })
  .option('directory', {
    alias: 'd',
    description: 'Package directory',
    demandOption: true
  })
  .option('zipfile', {
    alias: 'z',
    description: 'Package directory',
    demandOption: true
  })
  .option('minify', {
    alias: 'm',
    default: false,
    description: 'Export minified js'
  })
  .option('static', {
    alias: 's',
    description: 'Specify static folder'
  })
  .option('target', {
    alias: 't',
    description: 'Specify node target',
    default: 'node14'
  })
  .help()
  .argv;

function main() {
  // create build cmd
  const buildCmd = [
    'npx ld-build',
    `-e "${argv['entry']}"`,
    `-o "${argv['outfile']}"`,
  ];
  if (argv['minify']) {
    buildCmd.push('-m');
  }
  if (argv['static']) {
    buildCmd.push(`-s "${argv['static']}"`);
  }
  if (argv['target']) {
    buildCmd.push(`-t "${argv['target']}"`);
  }

  // create path to zip file
  const zipPath = path.relative(process.cwd(), argv['zipfile'].replace(/^\.\//, ''));

  execSync(buildCmd.join(' '), {stdio: 'inherit'});
  execSync(`npx ld-pack -e "${argv['directory']}" -o "${zipPath}"`, {stdio: 'inherit'});
  execSync(`aws lambda update-function-code --function-name "${argv['function-name']}" --zip-file "fileb://${zipPath}" --publish`, {stdio: 'inherit'});
}

main();
