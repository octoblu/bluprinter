import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import BluprintDetailPageActions from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<BluprintDetailPageActions />', () => {
  it('should render update version button', () => {
    const sut = shallow(<BluprintDetailPageActions />)
    expect(sut.find('#updateVersionBtn')).to.exist
  })

  describe('when updateVersionBtn is clicked', () => {
    it('should call handleUpdateVersion', () => {
      const handleUpdateVersion = sinon.spy()
      const sut = shallow(
        <BluprintDetailPageActions
          onUpdateVersion={handleUpdateVersion}
        />
      )
      const updateVersionBtn = sut.find('#updateVersionBtn')
      updateVersionBtn.simulate('click')

      expect(handleUpdateVersion).to.have.been.called
    })
  })
})
