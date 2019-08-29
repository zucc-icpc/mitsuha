# mitsuha

It's the front-end of Programming Contest Lab Community project for ZUCC-ICPC-LAB.

See back-end project [here](https://github.com/zucc-icpc/taki)

## Demo
[Here](http://47.100.57.37)

Demo username: test

Demo password: test

## Install

This project uses [yarn](https://github.com/yarnpkg/yarn) and Nginx. Go check them out if you don't have them locally installed.

### Development environment

```
$ git clone https://github.com/zucc-icpc/mitsuha.git
$ cd mitsuha
Install all dependencies for a project
$ yarn install
Run server with hot load
$ yarn start
```

### Production environment
You need to modify mitsuha/mitsuha_nginx.conf and mitsuha/src/utils/api.js(change the baseUrl to your backend server) to adapt your server first. 

Remember to link mitsuha/mitsuha_nginx.conf to /etc/nginx/sites-enabled/ and restart nginx.
```
$ git clone https://github.com/zucc-icpc/mitsuha.git
$ cd mitsuha
Install all dependencies for a project
$ yarn install
Build
$ yarn build
```
