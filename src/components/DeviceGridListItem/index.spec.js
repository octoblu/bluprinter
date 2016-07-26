import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'

import DeviceGridListItem from './'

chai.use(chaiEnzyme)
chai.use(sinonChai)

describe('<DeviceGridListItem />', () => {

  it('should render nothing', () => {
    const sut = shallow(<DeviceGridListItem />)
    expect(sut).to.be.empty
  })

  it('should render the device name', () => {
    const device = {
      uuid: '5',
      name: 'The Amazingly Awesome Bluprint',
      description: 'This device is amazing.'
    }
    const sut = shallow(<DeviceGridListItem device={device} />)
    expect(sut.find('div')).to.exist
  })

  it('should render the list item if you give it a device', () => {
    const device = {
      uuid: '5',
      name: 'The Amazingly Awesome Bluprint',
      description: 'This device is amazing.'
    }
    const onSelectionHandler = new sinon.stub()
    const sut = shallow(<DeviceGridListItem device={device} onSelection={onSelectionHandler}/>)
    sut.simulate('click')
    expect(onSelectionHandler).to.have.been.calledWith(device)
  })
})
