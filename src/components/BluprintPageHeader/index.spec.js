import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import BluprintPageHeader from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<BluprintPageHeader />', () => {
  describe('when given a device with name and logo', () => {
    it('should render the logo', () => {
      const device = { logo: 'icons.octoblu.com/cats', name: 'cats' }
      const sut = shallow(<BluprintPageHeader device={device} />)

      expect(sut.containsMatchingElement(
        <img src="icons.octoblu.com/cats" alt="cats" />
      )).to.equal(true)
    })
  })
})
