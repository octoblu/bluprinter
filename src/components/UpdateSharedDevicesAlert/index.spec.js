import _ from 'lodash'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow, mount} from 'enzyme'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import UpdateSharedDevicesAlert from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('<UpdateSharedDevicesAlert />', () => {
  describe('when sharedDevices prop is null', () => {
    it('should render nothing', () => {
      const sut = shallow(<UpdateSharedDevicesAlert />)
      expect(sut).to.be.empty
    })
  })

  describe('when given sharedDevices props', () => {
    describe('when UpdateSharedDevicesAlert props is empty', () => {
      it('should render nothing', () => {
        const sut = shallow(<UpdateSharedDevicesAlert sharedDevices={[]} />)
        expect(sut).to.be.empty
      })
    })

    describe('when sharedDevices props is not empty', () => {
      const sharedDevices = [{uuid: 'device-1-uuid', type:'device:one', name: 'My Device'}]
      it('should render', () => {
        const sut = shallow(<UpdateSharedDevicesAlert sharedDevices />)
        expect(sut).to.exist
      })

      describe('when update permissions button is clicked', () => {
        it('should call the handler', () => {
          const handleUpdatePermissions = sinon.spy()
          const sut = shallow(
            <UpdateSharedDevicesAlert
              sharedDevices={sharedDevices}
              onUpdatePermission={handleUpdatePermissions}
            />
          )

          const updatePermissionsBtn = sut.find({name: 'updatePermissions'})
          console.log(updatePermissionsBtn)
          updatePermissionsBtn.simulate('click')
          expect(handleUpdatePermissions).to.have.been.called
        })
      })
    })
  })
})
