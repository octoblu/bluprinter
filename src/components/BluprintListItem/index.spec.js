import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import BluprintListItem from './'

chai.use(chaiEnzyme)
chai.use(sinonChai)

describe('<BluprintListItem />', () => {

  it('should render nothing', () => {
    const sut = shallow(<BluprintListItem />)
    expect(sut).to.be.empty
  })

  it('should render the bluprint name', () => {
    const bluprint = {
      uuid: '5',
      name: 'The Amazingly Awesome Bluprint',
      description: 'This bluprint is amazing.'
    }
    const sut = shallow(<BluprintListItem bluprint={bluprint} />)
    expect(sut.find('h3')).to.exist
  })

  xit('should render the list item if you give it a bluprint', () => {
    const bluprint = {
      uuid: '5',
      name: 'The Amazingly Awesome Bluprint',
      description: 'This bluprint is amazing.'
    }
    const onSelectedHandler = new sinon.stub()
    const sut = shallow(<BluprintListItem bluprint={bluprint} onSelected={onSelectedHandler}/>)
    sut.find('div[name=5]').simulate('click')
    expect(onSelectedHandler).to.have.been.calledWith(bluprint)
  })
})
