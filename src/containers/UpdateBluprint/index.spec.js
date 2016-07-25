import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import UpdateBluprint from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<UpdateBluprint />', () => {
  it('should render nothing', () => {
    const sut = shallow(<UpdateBluprint />)
    expect(sut).to.be.empty
  })
})
