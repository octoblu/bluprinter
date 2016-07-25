import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import BluprintList from './'
import BluprintListItem from '../BluprintListItem/'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<BluprintList />', () => {
  it('should render nothing', () => {
    const sut = shallow(<BluprintList />)
    expect(sut).to.be.empty
  })

  it('should render multiple BluprintListItem components when given a list of bluprints', () => {
    const bluprints = [{
      uuid: 'bluprint-1',
      name: 'Bluprint 1',
    },
    {
      uuid: 'bluprint-2',
      name: 'Bluprint 2',
    }]

    const sut = shallow(<BluprintList bluprints={bluprints} />)
    expect(sut.find(BluprintListItem).length).to.equal(2)
  })
})
