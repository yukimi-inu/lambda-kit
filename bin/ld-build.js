#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs-extra');

// get cli options
const argv = yargs
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
  .option('minify', {
    alias: 'm',
    default: false,
    description: 'Export minified js'
  })
  .option('watch', {
    alias: 'w',
    description: 'Watch items'
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
  .option('external', {
    alias: 'x',
    array: true,
    description: 'Specity External Libraries',
    default: ['aws-sdk']
  })
  .help()
  .argv;

function main() {
  // Build script
  const options = {
    bundle: true,
    external: argv['external'] || ['aws-sdk'],
    minify: !!argv['minify'],
    platform: 'node',
    target: argv['target'],
    outfile: argv['outfile'],
    entryPoints: [argv['entry']],
    watch: !!argv['watch']
  };
  console.log('Build options:');
  console.log(options);

  const outDir = path.dirname(options.outfile);
  fs.mkdirsSync(outDir);

  const result = esbuild.buildSync(options);

  // copy static files
  if (argv['static']) {
    const staticPath = argv['static'];
    const staticBasename = path.basename(argv['static']);
    const outPath = path.join(outDir, staticBasename);
    if (!fs.existsSync(argv['static'])) {
      console.error('static directory is not exists.');
    }

    fs.copySync(staticPath, outPath);
    console.log('copy static dirs:', staticPath, '=>', outPath);
  }

  // Show result
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('Build: Success');
  } else if (result.errors.length === 0) {
    console.log('Build: Success, but some warnings.');
    result.warnings.forEach(warn => console.warn(warn));
  } else {
    console.error('Build: Failed');
    result.errors.forEach(error => console.error(error));
    result.warnings.forEach(warn => console.warn(warn));
  }
}

main();
