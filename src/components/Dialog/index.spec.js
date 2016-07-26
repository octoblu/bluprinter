import _ from 'lodash'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'

import Dialog from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<Dialog />', () => {
  describe('when given a body', () => {
    it('should render the dialog with the body', () => {
      const sut = shallow(
        <Dialog
          body="Gotta catch 'em all"
          onCancel={_.noop}
          onConfirm={_.noop}
          showDialog
        />)
      expect(sut).to.contain.text("Gotta catch 'em all")
    })
  })
  describe('when cancel is clicked', () => {
    it('should call the onCancel callback', () => {
      const cancelEverything = sinon.spy()
      const sut = shallow(
        <Dialog
          body="CANCELED"
          onCancel={cancelEverything}
          onConfirm={_.noop}
          showDialog
        />)
      const cancelBtn = sut.find({children: 'Cancel'})
      cancelBtn.simulate('click')
      expect(cancelEverything).to.have.been.called
    })
  })
  describe('when confirm is clicked', () => {
    it('should call the onConfirm callback', () => {
      const doIt = sinon.spy()
      const sut = shallow(<Dialog body="YAY" onCancel={_.noop} onConfirm={doIt} showDialog />)
      const confirmBtn = sut.find({children: 'Okay'})
      confirmBtn.simulate('click')
      expect(doIt).to.have.been.called
    })
  })
  describe('when showDialog is falsy', () => {
    it('should not render the dialog', () => {
      const sut = shallow(<Dialog showDialog={false} />)
      expect(sut).to.be.empty
    })
  })
})
