import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'
import Button from 'zooid-button'

import BluprintDetailPageActions from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<BluprintDetailPageActions />', () => {
  describe('when component renders', () => {
    let sut

    beforeEach(() => {
      sut = shallow(<BluprintDetailPageActions />)
    })

    it('should render a Delete Bluprint button', () => {
      expect(sut.containsMatchingElement(
        <Button kind="hollow-danger" disabled={false} size="small">
          Delete
        </Button>
      )).to.equal(true)
    })

    it('should render an Import Bluprint button', () => {
      expect(sut.containsMatchingElement(
        <Button kind="primary" disabled={false} size="small">
          Import
        </Button>
      )).to.equal(true)
    })
  })

  describe('when delete bluprint button is clicked', () => {
    it('should call handleDeleteBluprint', () => {
      const handleDeleteBluprint = sinon.spy()
      const sut = shallow(
        <BluprintDetailPageActions onDeleteBluprint={handleDeleteBluprint} />
      )
      const deleteBluprintBtn = sut.find({ children: 'Delete'})

      deleteBluprintBtn.simulate('click')
      expect(handleDeleteBluprint).to.have.been.called
    })
  })
})
