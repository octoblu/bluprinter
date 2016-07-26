import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import DeviceGridList from './'
import DeviceGridListItem from '../DeviceGridListItem/'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<DeviceGridList />', () => {
  it('should render nothing', () => {
    const sut = shallow(<DeviceGridList />)
    expect(sut).to.be.empty
  })

  it('should render multiple DeviceGridListItem components when given a list of bluprints', () => {
    const bluprints = [{
      uuid: 'bluprint-1',
      name: 'Bluprint 1',
    },
    {
      uuid: 'bluprint-2',
      name: 'Bluprint 2',
    }]

    const sut = shallow(<DeviceGridList devices={bluprints} />)
    expect(sut.find(DeviceGridListItem).length).to.equal(2)
  })
})
