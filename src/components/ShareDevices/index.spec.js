import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'

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

    it('should render a checkbox', () => {
      const sut = shallow(<ShareDevices sharedDevices={sharedDevices} />)
      expect(sut.find('input[type="checkbox"]').length).to.equal(1)
    })
    it('should call the onShareDevices when the checkbox is clicked', () => {
      const onShareDeviceHandler = sinon.stub()
      const sut = shallow(
        <ShareDevices
          sharedDevices={sharedDevices}
          onShareDevices={onShareDeviceHandler}
        />
      )
      const checkbox = sut.find('input[type="checkbox"]')
      checkbox.simulate('click', {
        target: {
          checked: true
        }
      })
      expect(onShareDeviceHandler).to.have.been.calledWith({
        shareExistingDevices: true,
        sharedDevices,
      })
      checkbox.simulate('click', {
        target: {
          checked: false
        }
      })
      expect(onShareDeviceHandler).to.have.been.calledWith({
        shareExistingDevices: false,
        sharedDevices,
      })
    })
  })
})
