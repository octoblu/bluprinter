import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'

import BluprintVersionSelect from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe.only('<BluprintVersionSelect />', () => {
  describe('When given a list of versions', () => {
    it('should render the versions as options', () => {
      const versions = [{version: '1.0.0'}, {version: '2.0.0'}]
      const sut = shallow(<BluprintVersionSelect versions={versions} latest="1.0.0" />)

      expect(sut.containsMatchingElement(
        <option value="1.0.0">1.0.0</option>
      )).to.equal(true)

      expect(sut.containsMatchingElement(
        <option value="2.0.0">2.0.0</option>
      )).to.equal(true)
    })
  })

  describe('when given an onChange function', () => {
    it('should call that function when a version is selected', () => {
      const handleChange = sinon.spy()
      const sut = shallow(<BluprintVersionSelect onChange={handleChange} />)
      const versionSelector = sut.find('select')
      versionSelector.simulate('change', '2.0.0')

      expect(handleChange).to.have.been.called
    })
  })
})
