import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'
import {SchemaContainer} from 'zooid-meshblu-device-editor'
import BluprintConfigureForm from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<BluprintConfigureForm />', () => {
  describe('when bluprint prop is undefined', () => {
    it('should render nothing', () => {
      const sut = shallow(<BluprintConfigureForm />)
      expect(sut).to.be.empty
    })
  })


  describe('when given a configure schema as a prop', () => {
    const schema = {
      type: 'object',
      properties: {
        'Dev Github': {
          type: 'string',
          'x-node-map': [
            {
              id: '459973e0-396a-11e6-9a46-0518f4285907',
              property: 'uuid',
            }
          ]
        }
      }
    }

    xit('should render a json-schema form with the schema', () => {
      const sut = shallow(<BluprintConfigureForm schema={schema} />)
      expect(sut).to.contain(< SchemaContainer schema={schema} />)
    })
  })
})
