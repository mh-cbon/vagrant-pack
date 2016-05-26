# vagrant-pack

Tool to pack your local vagrant boxes to a `tar.gz` file

# Install

```sh
npm i @mh-cbon/vagrant-pack -g
```

# Usage

```sh
vagrant-pack 1.0.0

Usage: vagrant-pack [options]

List vagrant box available on your computer
 vagrant-pack --list|-l

Pack the vagrant boxes listed in the command
  vagrant-pack [box name] [box name] [options]
   -d|--directory [path] Target directory to save the box
                         Default value: .

Examples:
 vagrant-pack --list
 vagrant-pack some/centos5 -d some/where
 vagrant-pack some/centos5 Unode/gentoo-x86 some/centos56
```
