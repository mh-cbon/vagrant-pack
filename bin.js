var argv      = require('minimist')(process.argv.slice(2))
var tar       = require('tar-fs')
var fs        = require('fs')
var path      = require('path')
var boxList   = require('@mh-cbon/vagrant-box-list');
var zlib      = require('zlib');
var pkg       = require('./package.json');
var Spinner   = require('cli-spinner').Spinner;

var saveDir = argv.d || argv.directory || '.';
var boxes = argv['_'].splice(0);

if (argv.help || argv.h) {
  console.error('%s %s', pkg.name, pkg.version)
  console.error('')
  console.error('Usage: vagrant-pack [options]')
  console.error('')
  console.error('List vagrant box available on your computer')
  console.error(' vagrant-pack --list|-l')
  console.error('')
  console.error('Pack the vagrant boxes listed in the command')
  console.error(' vagrant-pack [box name] [box name] [box name]')
  console.error('   -d|--directory [path] Target directory to save the box')
  console.error('                         Default value: .')
  console.error('')
  console.error('Examples:')
  console.error(' vagrant-pack --list')
  console.error(' vagrant-pack some/centos5 -d some/where')
  console.error(' vagrant-pack some/centos5 Unode/gentoo-x86 some/centos56')
  process.exit(1)
}

if (argv.list || argv.l) {
  return boxList(function (err, items) {
    if (err) {
      process.exitCode = 1;
      return console.error(err);
    }
    console.log(JSON.stringify(items.map(function (b) { return b.name; }), null, 2))
  })
}

var spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');
var todo = 0;
boxList(function (err, items) {
  boxes.forEach(function (box) {
    var item = items.filter(function (item) {
      return item.name===box;
    });

    if(!item) return console.error('box not found: %s', box);
    item = item[0];

    Object.keys(item.versions).forEach(function (version) {
      Object.keys(item.versions[version]).forEach(function (provider) {
        var name = item.name
        .replace(/\//g, '-VAGRANTSLASH-')
        .replace(/\\/g, '-VAGRANTSLASH-');
        name += '-' + version + '-' + provider + '.tar.gz';
        todo===0 && spinner.start();
        todo++;
        var target = path.join(saveDir, name);
        tar.pack(item.path, {
          entries: item.versions[version][provider].map(function (d) {
            return path.relative(item.path, d);
          })
        })
        .pipe(zlib.Gzip())
        .pipe(fs.createWriteStream(target))
        .on('close', function (){
          spinner.stop(true);
          console.log('Finished to pack %s', target);
          spinner.start();
          todo--;
          todo===0 && spinner.stop(true);
        })
      })
    })
  })
});
