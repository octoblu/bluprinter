#!/bin/bash
SERVER="meshblu.octoblu.com:443"
meshblu-util register -s $SERVER -o -t device:bluprint > bluprint.json
meshblu-util update -f ./bluprint-config.json ./bluprint.json
