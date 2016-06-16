#!/usr/bin/env node
var MeshbluHttp = require('meshblu-http')
var program = require('commander')

var server = 'meshblu.octoblu.com:443'

program
  .version('0.0.1')
  .option('-o, --owner', 'Set Owner UUID')
  .option('-n, --name', 'Set Device Name')
  .option('-s, --server', 'Set meshblu server')
  .parse(process.argv)

if (!program.owner) {
  console.log('An owner UUID is required, please pass in an owner')
  process.exit(1)
}

if (program.server) server = program.server

console.log('Using Meshblu Server: ' + server)


var meshbluHttp = new MeshbluHttp({
  server: server,
})

meshbluHttp.register({ type: 'device: generic' }, function (error, registeredDevice) {
  meshbluHttp.update(registeredDevice.uuid, {
    owner: program.owner,
    name: program.name || 'Generated Device',
    schemas: {
      message: {},
    },
    meshblu: {
      whitelists: {
        discover: {
          view: [{ uuid: program.owner }, { uuid: registeredDevice.uuid }],
        },
        configure: {
          update: [{ uuid: program.owner }, { uuid: registeredDevice.uuid }],
        },
      },
    },
  }, function (updateError) {
    if (updateError) {
      console.error('Permission update failed')
      process.exit(1)
    }

    console.log('Device Created ')
    console.log(JSON.stringify(registeredDevice, null, 2))
  })
})
