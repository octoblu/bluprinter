import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import { MESHBLU_HOST } from 'config'
import FlowService from './flow-service'
import deviceWithSchema from '../../test/data/device-with-schema.json'
import nock from 'nock'

chai.use(chaiSubset)

describe('FlowService', () => {
  let flowService
  beforeEach(() => {
    flowService = new FlowService({
      uuid: 'my-meshblu-uuid',
      token: 'my-meshblu-token',
      hostname: `${MESHBLU_HOST}`,
      port: 443,
    })
  })

  xdescribe('->getNodeSchemaMap', () => {
    it('should exist', () => {
      expect(flowService.getNodeSchemaMap).to.exist
    })

    context('When given a Flow with a device node', () => {
      let scope
      const flow = {
        uuid: 'something-fly',
        nodes: [
          {
            uuid: 'my-iot-device-uuid',
            category: 'device',
            type: 'device:generic',
            staticMessage: {
              optionA: 'stuff I like',
              optionB: 'stuff I don\'t like',
            },
          },
        ],
      }

      beforeEach((done) => {
        scope = nock(`https://${MESHBLU_HOST}`, {allowUnmocked: true})
        .get('/v2/devices/my-iot-device-uuid')
        .basicAuth({
          user: 'my-meshblu-uuid',
          pass: 'my-meshblu-token',
        })
        .reply(200, deviceWithSchema)
        done()
      })

      it('should add the device message schema to the outgoing map', (done) => {
        const sut = flowService.getNodeSchemaMap(flow)
        expect(scope.isDone()).to.equal(true)
        expect(sut).to.containSubset({
          uuid: 'my-iot-device-uuid',
          schemas: {
            message: deviceWithSchema.schemas.message,
          },
        })
        done()
      })
    })
  })
})
