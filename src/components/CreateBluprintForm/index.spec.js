import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import CreateBluprintForm from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<CreateBluprintForm />', () => {
  it('should render nothing', () => {
    const sut = shallow(<CreateBluprintForm />)
    expect(sut).to.be.empty
  })
})
