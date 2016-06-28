import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import { mount, shallow } from 'enzyme'
import Button from 'zooid-button'

import BluprintDetail from './'

chai.use(chaiEnzyme())

describe('<BluprintDetail />', () => {
  it('should have default state', () => {
    const sut = mount(<BluprintDetail routeParams={{ uuid: 'fancy' }} />)
    expect(sut.state()).to.deep.equal({
      device: null,
      error: null,
      loading: true,
      alertMessage: null,
      updatingVersion: false
    })
  })

  describe('when loading state is false', () => {
    let sut

    beforeEach(() => {
      sut = mount(<BluprintDetail routeParams={{ uuid: 'fancy' }} />)
      sut.setState({ loading: false })
    })

    describe('when error state is set', () => {
      it('should render the error message', () => {
        sut.setState({
          error: new Error('Bang! Bang!'),
        })

        expect(sut).to.contain.text('Error: Bang! Bang!')
      })
    })

    describe('when there is a device', () => {
      beforeEach(() => {
        sut.setState({
          device: {
            uuid: 'my-new-uuid',
            name: 'Device name',
            bluprint: {},
          },
        })
      })

      it('should show the device', () => {
        expect(sut).to.not.contain.text('Loading...')
        expect(sut).to.not.contain.text('Error: Bang! Bang!')
        expect(sut).to.contain.text('Device name')
      })
    })
  })
})
