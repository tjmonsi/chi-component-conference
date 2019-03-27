#!/bin/bash

echo 'start'

if [ -f ./node_modules/localforage/.babelrc ]; then
  echo 'deleting babelrc in localforage'
  rm ./node_modules/localforage/.babelrc
fi