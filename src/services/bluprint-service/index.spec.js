import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import { getLatestConfigSchema } from './'

chai.use(chaiSubset)

describe('BluprintService', () => {
  describe('->getLatestConfigSchema', () => {
    it('should return null if bluprint has no latest property', () => {
      const bluprint = {}
      expect(getLatestConfigSchema(bluprint)).to.equal(null)
    })

    it('should return null if bluprint has no versions', () => {
      const bluprint = {
        latest: '1.0.0',
      }
      expect(getLatestConfigSchema(bluprint)).to.equal(null)
    })

    it('should return null if bluprint verions has no version matching the latest', () => {
      const bluprint = {
        latest: '1.0.0',
        versions: [
          {
            version: '1.0.1',
          },
        ]
      }

      expect(getLatestConfigSchema(bluprint)).to.equal(null)
    })

    describe('when bluprint has version that matches latest', () => {
      it('should return a configure schema', () => {
        const bluprint = {
          latest: '1.0.0',
          versions: [{
            version: '1.0.0',
            schemas: {
              configure: {
                bluprint: {
                  type: 'object',
                  properties: {
                    'Dev Github': {
                      type: 'string',
                      'x-node-map': [
                        {
                          id: '459973e0-396a-11e6-9a46-0518f4285907',
                          property: 'uuid'
                        }
                      ]
                    }
                  }
                }
              },
            }
          }]
        }

        expect(getLatestConfigSchema(bluprint)).to.deep.equal({
          type: 'object',
          properties: {
            'Dev Github': {
              type: 'string',
              'x-node-map': [
                {
                  id: '459973e0-396a-11e6-9a46-0518f4285907',
                  property: 'uuid'
                }
              ]
            }
          }
        })
      })
    })
  })
})
