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
  .help()
  .argv;

async function main() {
  // run script
  const scriptPath = path.resolve(process.cwd(), argv['entry']);

  let event = {};
  let context = {};
  if (argv['event']) {
    event = JSON.parse(fs.readFileSync(argv['event'], {encoding: 'utf-8'}));
  }
  if (argv['context']) {
    context = JSON.parse(fs.readFileSync(argv['context'], {encoding: 'utf-8'}));
  }

  const fn = require(scriptPath);
  const output = await fn[argv['handler']](event, context);
  console.log(output);
}

main();