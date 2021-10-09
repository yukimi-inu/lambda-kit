#!/usr/bin/env node
const fs = require('fs');
const archiver = require('archiver');
const yargs = require("yargs");

// get cli options
const argv = yargs
  .option('entry', {
    alias: 'e',
    description: 'entry directory',
    demandOption: true
  })
  .option('outfile', {
    alias: 'o',
    description: 'Output zip',
    demandOption: true
  })
  .help()
  .argv;

function main() {
  // Create zip package
  const output = fs.createWriteStream(argv['outfile']);
  const archive = archiver('zip', {
    zlib: {level: 9}
  });
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Pack: Closed');
  });

  archive.on('warning', function (err) {
    console.log(err);
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.directory(argv['entry'], '.');
  archive.finalize();
}

main();