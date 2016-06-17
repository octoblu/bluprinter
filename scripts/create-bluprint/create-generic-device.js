#!/usr/bin/env node
var MeshbluHttp = require('meshblu-http')
var commander = require('commander')

// var meshbluServer = 'meshblu.octoblu.com:443'
var owner, deviceName, meshbluServer;
commander
  .version('0.0.1')
  .option('-o, --owner <uuid>', 'Set Owner UUID', String)
  .option('-n, --name <name>', 'Set Device Name', String)
  .option('-s, --server <server>', 'Set meshblu server', String)
  .parse(process.argv)

console.log(commander.owner,  commander.name, commander.server);

if (!commander.owner) {
  console.log('An owner UUID is required, please pass in an owner')
  process.exit(1)
}

if (commander.server) meshbluServer = commander.server

console.log('Using Meshblu Server: ' + commander.server)


var meshbluHttp = new MeshbluHttp({
  server: meshbluServer
})

var deviceParams =  {
  owner: commander.owner,
  name: commander.name || 'Generated Device',
  "meshblu": {
      "version": "2.0.0",
      "whitelists": {
        "discover": {
          "view": [
            {
              "uuid": "*"
            },
            {
              "uuid": commander.owner
            }
          ]
        },
        "configure": {
          "update": [
            {
              "uuid": commander.owner
            }
          ]

        },
      }
  },
  schemas: {
    version: "2.0.0",
    message: {
      "example-message-01": {
        "type": "object",
        "properties": {
          "example-opt": {
            "type": "string",
            "enum": ["optionA", "optionB", "optionC"]
          },
          "another-example-opt":{
            "type": "string"
          }
        },
        "required": ["example-opt", "another-example-opt"]
      },
      "example-message-02": {
        "type": "object",
        "properties": {
          "some-opt": {
            "type": "string"
          },
          "another-some-opt":{
            "type": "string"
          }
        },
        "required": ["some-opt", "another-some-opt"]
      }
    }
  }
};

meshbluHttp.register(deviceParams, function (error, registeredDevice) {
  console.error(error)
  var meshbluHttp = new MeshbluHttp({
    uuid: registeredDevice.uuid,
    token: registeredDevice.token,
    server: meshbluServer
  })
  meshbluHttp.device(registeredDevice.uuid, function(deviceError, updatedDevice){
    console.log("Device is", deviceError, JSON.stringify(updatedDevice, null, 2));
    process.exit(0);
  });

});
