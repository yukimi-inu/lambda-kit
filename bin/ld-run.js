#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");

// get cli options
const argv = yargs
  .option('entry', {
    alias: 'e',
    description: 'Entry pattern',
    demandOption: true
  })
  .option('event', {
    alias: 'i',
    description: 'Event json',
    demandOption: false,
  })
  .option('context', {
    alias: 'c',
    description: 'Context json',
    demandOption: false,
  })
  .option('handler', {
    alias: 'h',
    description: 'handler name',
    default: 'handler'
  })
  .option('stringify', {
    alias: 's',
    description: 'output stringify JSON'
  })
  .option('pretty-print', {
    alias: 'p',
    description: 'output pretty stringify JSON'
  })
  .option('directory', {
    alias: 'd',
    description: 'Specifies the execution directory. If there is no argument, it will be based on the script directory'
  })
  .help()
  .argv;

async function main() {
  const scriptPath = path.resolve(process.cwd(), argv['entry']);

  let event = {};
  let context = {};
  if (argv['event']) {
    event = JSON.parse(fs.readFileSync(argv['event'], {encoding: 'utf-8'}));
  }
  if (argv['context']) {
    context = JSON.parse(fs.readFileSync(argv['context'], {encoding: 'utf-8'}));
  }

  if (argv['directory']) {
    let p = path.dirname(scriptPath);
    if (typeof argv['directory'] === 'string') {
      p = path.resolve(process.cwd(), argv['directory']);
    }
    process.chdir(p);
  }

  const fn = require(scriptPath);
  const output = await fn[argv['handler']](event, context);
  if (argv.s) {
    console.log(argv.p ? JSON.stringify(output, null, ' ') : JSON.stringify(output));
  } else {
    console.log(output);
  }
}

main();