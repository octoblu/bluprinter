import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'
import Button from 'zooid-button'

import RunPageActions from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<RunPageActions />', function () {
  describe('when component renders for an online device', function () {
    beforeEach(function () {
      this.sut = shallow(<RunPageActions online />)
    })

    it('should render a stop button', function () {
      expect(this.sut.containsMatchingElement(
        <Button kind="hollow-danger" disabled={false} size="small">
          Stop
        </Button>
      )).to.be.true
    })
  })

  describe('when component renders for an offline device', function () {
    beforeEach(function () {
      this.sut = shallow(<RunPageActions />)
    })

    it('should render a stop button', function () {
      expect(this.sut.containsMatchingElement(
        <Button kind="hollow-danger" disabled={false} size="small">
          Stop
        </Button>
      )).to.be.false
    })
  })

  describe('when component renders for an online device', function () {
    beforeEach(function () {
      this.sut = shallow(<RunPageActions online />)
    })

    it('should render a stop button', function () {
      expect(this.sut.containsMatchingElement(
        <Button kind="hollow-approve" disabled={false} size="small">
          Start
        </Button>
      )).to.be.false
    })
  })

  describe('when component renders for an offline device', function () {
    beforeEach(function () {
      this.sut = shallow(<RunPageActions />)
    })

    it('should render a stop button', function () {
      expect(this.sut.containsMatchingElement(
        <Button kind="hollow-approve" disabled={false} size="small">
          Start
        </Button>
      )).to.be.true
    })
  })


  describe('when onStart button is clicked', function () {
    it('should call handleOnStart', function () {
      const handleOnStart = sinon.spy()
      const sut = shallow(
        <RunPageActions onStart={handleOnStart} />
      )
      sut.find({ children: 'Start'}).simulate('click')
      expect(handleOnStart).to.have.been.called
    })
  })

  describe('when onStop button is clicked', function () {
    it('should call handleOnStop', function () {
      const handleOnStop = sinon.spy()
      const sut = shallow(
        <RunPageActions online onStop={handleOnStop} />
      )
      sut.find({ children: 'Stop'}).simulate('click')
      expect(handleOnStop).to.have.been.called
    })
  })
})
