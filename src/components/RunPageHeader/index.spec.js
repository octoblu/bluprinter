import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import RunPageHeader from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<RunPageHeader />', () => {
  describe('when given a device with name and logo', () => {
    it('should render the logo', () => {
      const device = { logo: 'icons.octoblu.com/cats', name: 'cats' }
      const sut = shallow(<RunPageHeader device={device} />)

      expect(sut.containsMatchingElement(
        <img src="icons.octoblu.com/cats" alt="cats" />
      )).to.equal(true)
    })
  })

  describe('when the device is online', () => {
    it('should render the online tag', () => {
      const device = { logo: 'icons.octoblu.com/cats', name: 'cats', online: true }
      const sut = shallow(<RunPageHeader device={device} />)

      expect(sut.containsMatchingElement(
        <span>Online</span>
      )).to.equal(true)
    })
  })

  describe('when the device is offline', () => {
    it('should render the offline tag', () => {
      const device = { logo: 'icons.octoblu.com/cats', name: 'cats', online: false }
      const sut = shallow(<RunPageHeader device={device} />)

      expect(sut.containsMatchingElement(
        <span>Offline</span>
      )).to.equal(true)
    })
  })
})
