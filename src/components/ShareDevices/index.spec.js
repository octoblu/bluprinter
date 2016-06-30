import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'
import Alert from 'zooid-alert'

import ShareDevices from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<ShareDevices />', () => {
  describe('when sharedDevices prop is null', () => {
    it('should render nothing', () => {
      const sut = shallow(<ShareDevices />)
      expect(sut).to.be.empty
    })
  })
  describe('when sharedDevices prop is an array', () => {
    const sharedDevices = ['first-uuid', 'second-uuid', 'third-uuid']

  it('should render an alert', () => {
      const sut = shallow(<ShareDevices sharedDevices={sharedDevices} />)
      expect(sut.containsMatchingElement(Alert)).to.equal(true)
  })
})
})
