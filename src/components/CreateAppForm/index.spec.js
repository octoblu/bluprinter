import noop from 'lodash.noop'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'

import CreateAppForm from './'

chai.use(chaiEnzyme())

describe('<CreateAppForm />', () => {
  it('should default onCreate to noop if no onCreate function is passed in', () => {
    const sut = mount(<CreateAppForm />)
    expect(sut).to.have.prop('onCreate').equal(noop)
  })

  it('should call the onCreate prop on Submit', () => {
    const onCreateHandler = sinon.spy()
    const sut = mount(<CreateAppForm onCreate={onCreateHandler} />)

    sut.simulate('submit')
    expect(onCreateHandler).to.have.been.called
  })
})
