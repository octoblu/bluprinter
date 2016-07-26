import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import DeviceHeader from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<DeviceHeader />', () => {
  let device

  beforeEach('Initialize Device', () => {
    device = {
      uuid: '007',
      name: 'Device Name',
      logo: 'foo.png',
    }
  })

  describe('When given device as prop', () => {
    let sut
    beforeEach(() => {
      device = {
        uuid: '007',
        name: 'Device Name',
        logo: 'foo.png',
      }

      sut = shallow(<DeviceHeader device={device} />)
    })

    it('should render device attributes', () => {
      expect(sut).to.contain('Device Name')
      expect(sut).to.contain(<img src="foo.png" alt="Device Name" />)
    })
  })

  describe('when given children as prop', () => {
    let sut

    beforeEach(() => {
      sut = shallow(
        <DeviceHeader device={device}>
          <div>Actions...</div>
        </DeviceHeader>
      )
    })

    it('should render children', () => {
      expect(sut).to.contain(<div>Actions...</div>)
    })
  })
})
