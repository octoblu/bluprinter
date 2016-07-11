import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'
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

    xit('should render an update version button', () => {
      expect(sut.containsMatchingElement(
        <Button kind="hollow-neutral" size="small" disabled={false}>
          Update Version
        </Button>
      )).to.equal(true)
    })

    it('should render a Delete Bluprint button', () => {
      expect(sut.containsMatchingElement(
        <Button kind="hollow-danger" disabled={false}>
          Delete
        </Button>
      )).to.equal(true)
    })

    it('should render an Import Bluprint button', () => {
      expect(sut.containsMatchingElement(
        <Button kind="primary" disabled={false}>
          Import
        </Button>
      )).to.equal(true)
    })
  })

  describe('when updateVersionBtn is clicked', () => {
    xit('should call handleUpdateVersion', () => {
      const handleUpdateVersion = sinon.spy()
      const sut = shallow(
        <BluprintDetailPageActions onUpdateVersion={handleUpdateVersion} />
      )
      const updateVersionBtn = sut.find({ children: 'Update Version'})

      updateVersionBtn.simulate('click')
      expect(handleUpdateVersion).to.have.been.called
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
