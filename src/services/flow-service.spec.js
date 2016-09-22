import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import FlowService from './flow-service'
import deviceWithSchema from '../../test/data/device-with-schema.json'
import shmock from 'shmock'
import enableDestroy from 'server-destroy'

chai.use(chaiSubset)

xdescribe('FlowService', function () {
  let flowService
  let meshbluMock
  beforeEach(function () {
    meshbluMock = shmock(0xDEAD)
    enableDestroy(meshbluMock)

    flowService = new FlowService({
      uuid: 'my-meshblu-uuid',
      token: 'my-meshblu-token',
      hostname: '127.0.0.1',
      port: 0xDEAD,
    })
  })
  afterEach(function (done) {
    meshbluMock.destroy(done)
  })

  describe('->addGlobalMessageReceivePermissions', function () {
    describe('when given a list of device uuids', function () {
      let firstDeviceHandler
      let secondDeviceHandler
      beforeEach(function (done) {
        const userAuth = new Buffer('my-meshblu-uuid:my-meshblu-token').toString('base64')
        const sharedDevices = ['device-1-uuid', 'device-2-uuid']
        meshbluMock.post('/search/devices')
          .send({
            uuid: {
              $in: ['device-1-uuid', 'device-2-uuid']
            },
            'meshblu.version': '2.0.0'
          })
          .reply(200, [{uuid: 'device-1-uuid'}])


        firstDeviceHandler = meshbluMock.put('/v2/devices/device-1-uuid')
          .send({
            $addToSet: {
              'meshblu.whitelists.message.from': {uuid: '*'},
              'meshblu.whitelists.broadcast.sent': {uuid: '*'}
            }
          })
          .set('Authorization', `Basic ${userAuth}`)
          .reply(200, deviceWithSchema)

        secondDeviceHandler = meshbluMock.put('/v2/devices/device-2-uuid')
          .send({
            $addToSet: {
              sendWhitelist: '*',
              receiveWhitelist: '*'
            }
          })
          .set('Authorization', `Basic ${userAuth}`)
          .reply(200, deviceWithSchema)

        flowService.addGlobalMessageReceivePermissions(sharedDevices, done)
      })

      it('should actually try to update both devices dangerously', function () {
        firstDeviceHandler.done()
        secondDeviceHandler.done()
      })
    })
  })

  describe('->updatePermissions', function () {
    describe('when called', function () {
      beforeEach(function (done) {
        const schema = {
          type: 'object',
          properties: {
            erik: {
              type: 'string',
              format: 'meshblu-device'
            }
          }
        }

        const appData = {
          erik: 'n00b'
        }

        this.v2SearchHandler =
          meshbluMock.post('/search/devices')
            .send({
              uuid: {
                $in: ['n00b']
              },
              'meshblu.version': '2.0.0'
            })
            .reply(200, [])

        this.updateDeviceHandler =
          meshbluMock.put('/v2/devices/the-uuid')
            .send({ $addToSet: { sendWhitelist: { $each: ['n00b'] } } })
            .reply(200)

        this.updateN00bHandler =
          meshbluMock.put('/v2/devices/n00b')
            .send({ $addToSet: { receiveWhitelist: 'the-uuid', sendWhitelist: 'the-uuid' }})
            .reply(200)

        flowService.updatePermissions({uuid: 'the-uuid', appData, schema}, done)
      })

      it('should update the IoT device\'s sendWhitelist', function () {
        this.updateDeviceHandler.done()
      })

      it('should update the n00b device\'s receiveWhitelist', function () {
        this.updateN00bHandler.done()
      })
    })
  })

  describe('->_getDevicesAndEventTypes', function() {
    describe('when called with a bunch of complicated objects', function(){
      beforeEach(function(){
        this.manifest = [
          {
            "name": "Message Device",
            "id": "0f15ba60-7c57-11e6-8e1e-63491afd6875",
            "type": "octoblu:flow",
            "documentation": "",
            "category": "device",
            "eventType": "message"
          },
          {
            "name": "Configure Device",
            "id": "02c766d0-7e98-11e6-a842-b1b930235465",
            "type": "octoblu:flow",
            "documentation": "",
            "category": "device",
            "eventType": "configure"
          }
        ]
        this.schema = {
          "type": "object",
          "properties": {
            "messageDevice": {
              "type": "string",
              "x-meshblu-device-filter": {
                "type": "octoblu:flow"
              },
              "format": "meshblu-device",
              "x-node-map": [
                {
                  "id": "0f15ba60-7c57-11e6-8e1e-63491afd6875",
                  "property": "uuid"
                }
              ]
            },
            "configureDevice": {
              "type": "string",
              "x-meshblu-device-filter": {
                "type": "octoblu:flow"
              },
              "format": "meshblu-device",
              "x-node-map": [
                {
                  "id": "02c766d0-7e98-11e6-a842-b1b930235465",
                  "property": "uuid"
                }
              ]
            }
          }
        }
        this.appData = {
          "messageDevice": "694b3b74-dc71-411f-8c5a-d0ba6976f4b4",
          "configureDevice": "c8addefd-0b4d-4a14-a100-b786db47e446"
        }
        this.sharedDevices = [
          {uuid: '1', eventTypes: ['configure']},
          {uuid: '2', eventTypes: ['message']}
        ]
      })
      it ('should return a list of device uuids and their event types', function(){
        const expectedResult = [
          {
              uuid: "694b3b74-dc71-411f-8c5a-d0ba6976f4b4",
              eventTypes: ['message']
          },
          {
              uuid: "c8addefd-0b4d-4a14-a100-b786db47e446",
              eventTypes: ['configure']
          },
          {
            uuid: '1',
            eventTypes: ['configure']
          },
          {
            uuid: '2',
            eventTypes: ['message']
          }
        ]
        const result = flowService._getDevicesAndEventTypes({manifest: this.manifest, schema: this.schema, appData: this.appData, sharedDevices: this.sharedDevices})
        expect(result).to.deep.contain.same.members(expectedResult)
      })
    })
    describe('when called with a schema that points to more than one node', function(){
      beforeEach(function(){
        this.manifest = [
          {
            "name": "Message Device",
            "id": "0f15ba60-7c57-11e6-8e1e-63491afd6875",
            "type": "octoblu:flow",
            "documentation": "",
            "category": "device",
            "eventType": "message"
          },
          {
            "name": "Configure Device",
            "id": "02c766d0-7e98-11e6-a842-b1b930235465",
            "type": "octoblu:flow",
            "documentation": "",
            "category": "device",
            "eventType": "configure"
          }
        ]
          this.schema = {
            "type": "object",
            "properties": {
              "messageDevice": {
                "type": "string",
                "x-meshblu-device-filter": {
                  "type": "octoblu:flow"
                },
                "format": "meshblu-device",
                "x-node-map": [
                  {
                    "id": "0f15ba60-7c57-11e6-8e1e-63491afd6875",
                    "property": "uuid"
                  },
                  {
                    "id": "02c766d0-7e98-11e6-a842-b1b930235465",
                    "property": "uuid"
                  },
                ]
              }
            }
        }
        this.appData = {
          "messageDevice": "694b3b74-dc71-411f-8c5a-d0ba6976f4b4"
        }
      })

      it ('should return a list of device uuids and their event types', function(){
        const expectedResult = [
          {
              uuid: "694b3b74-dc71-411f-8c5a-d0ba6976f4b4",
              eventTypes: ['message', 'configure']
          },
        ]
        const result = flowService._getDevicesAndEventTypes({manifest: this.manifest, schema: this.schema, appData: this.appData})
        expect(result).to.deep.contain.same.members(expectedResult)
      })
    })
    describe('when called with a schema that points to more than one node with the same eventType', function(){
      beforeEach(function(){
        this.manifest = [
          {
            "name": "Message Device",
            "id": "0f15ba60-7c57-11e6-8e1e-63491afd6875",
            "type": "octoblu:flow",
            "documentation": "",
            "category": "device",
            "eventType": "message"
          },
          {
            "name": "Configure Device",
            "id": "02c766d0-7e98-11e6-a842-b1b930235465",
            "type": "octoblu:flow",
            "documentation": "",
            "category": "device",
            "eventType": "message"
          }
        ]
          this.schema = {
            "type": "object",
            "properties": {
              "messageDevice": {
                "type": "string",
                "x-meshblu-device-filter": {
                  "type": "octoblu:flow"
                },
                "format": "meshblu-device",
                "x-node-map": [
                  {
                    "id": "0f15ba60-7c57-11e6-8e1e-63491afd6875",
                    "property": "uuid"
                  },
                  {
                    "id": "02c766d0-7e98-11e6-a842-b1b930235465",
                    "property": "uuid"
                  },
                ]
              }
            }
        }
        this.appData = {
          "messageDevice": "694b3b74-dc71-411f-8c5a-d0ba6976f4b4"
        }
      })

      it ('should return a list of device uuids and their event types', function(){
        const expectedResult = [
          {
              uuid: "694b3b74-dc71-411f-8c5a-d0ba6976f4b4",
              eventTypes: ['message']
          },
        ]
        const result = flowService._getDevicesAndEventTypes({manifest: this.manifest, schema: this.schema, appData: this.appData})
        expect(result).to.deep.contain.same.members(expectedResult)
      })
    })
  })
  describe('when called and the app is configured with a v2 device', function () {
    beforeEach(function (done) {
      const messageFromDevices = ['the-interval-service']
      const schema = {
        type: 'object',
        properties: {
          erik: {
            type: 'string',
            format: 'meshblu-device'
          },
          kire: {
            type: 'string',
            format: 'meshblu-device'
          }
        }
      }

      const appData = {
        erik: 'n00b',
        kire: '1337'
      }

      this.v2SearchHandler =
        meshbluMock.post('/search/devices')
          .send({
            uuid: {
              $in: ['n00b', '1337']
            },
            'meshblu.version': '2.0.0'
          })
          .reply(200, [{uuid: '1337'}])

      this.updateDeviceHandler =
        meshbluMock.put('/v2/devices/the-uuid')
        .send({ $addToSet: { sendWhitelist: { $each: ['n00b', '1337', 'the-interval-service'] } } })
        .reply(200)

      this.updateN00bHandler =
        meshbluMock.put('/v2/devices/n00b')
          .send({ $addToSet: { receiveWhitelist: 'the-uuid', sendWhitelist: 'the-uuid' }})
          .reply(200)

      this.update1337Handler =
        meshbluMock.put('/v2/devices/1337')
          .send({
            $addToSet: {
              'meshblu.whitelists.message.from': {
                uuid: 'the-uuid'
              },
              'meshblu.whitelists.broadcast.sent': {
                uuid: 'the-uuid'
              }
            }
          })
          .reply(200)
      flowService.updatePermissions({uuid: 'the-uuid', appData, schema, messageFromDevices}, done)
    })

    it('should update the n00b device\'s whitelists', function () {
      this.updateN00bHandler.done()
    })

    it('should update the 1337 device\'s v2 whitelists', function () {
      this.update1337Handler.done()
    })
  })
})
