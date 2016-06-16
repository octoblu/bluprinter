#!/bin/bash
SERVER="meshblu.octoblu.dev"
meshblu-util register -s $SERVER -o -t device:generic > generic-device.json
meshblu-util update -f ./bluprint-config.json ./bluprint.json
