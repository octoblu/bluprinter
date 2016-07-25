import _ from 'lodash'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'

import ShareDevices from '../ShareDevices/'
import CreateAppForm from './'

chai.use(chaiEnzyme())

describe('<CreateAppForm />', () => {
  it('should default onCreate to noop if no onCreate function is passed in', () => {
    const sut = mount(<CreateAppForm />)
    expect(sut).to.have.prop('onCreate').equal(_.noop)
  })

  xit('should call the onCreate prop on Submit', () => {
    const onCreateHandler = sinon.spy()
    const sut = mount(<CreateAppForm onCreate={onCreateHandler} />)

    sut.simulate('submit')
    expect(onCreateHandler).to.have.been.called
  })
  describe('when given a shared devices prop', () => {
    it('should render the ShareDevices component', () => {
      const sharedDevices = ['my-first-uuid', 'my-second-uuid']
      const sut = shallow(<CreateAppForm sharedDevices={sharedDevices} />)
      expect(sut.find(ShareDevices).length).to.equal(1)
    })
  })
  describe('when shared devices prop is null', () => {
    it('should not render the ShareDevices component', () => {
      const sut = shallow(<CreateAppForm />)
      expect(sut.find(ShareDevices)).to.be.empty
    })
  })
})
