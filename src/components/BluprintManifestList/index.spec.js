import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'
import Button from 'zooid-button'
import DeviceIcon from 'zooid-device-icon'
import Heading from 'zooid-heading'

import BluprintManifestList from './'
import styles from './styles.css'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<BluprintManifestList />', () => {
  describe('when manifest prop is not specified', () => {
    it('should render nothing', () => {
      const sut = shallow(<BluprintManifestList />)
      expect(sut).to.be.empty
    })
  })

  describe('When manifest is specified with at least one element', () => {
    let manifest = [
      {
        documentation: 'http://octoblu-designer.readme.io/docs/trigger',
        id: '585092b0-3993-11e6-a61c-632f7ee1688a',
        name: 'Trigger',
        type: 'operation:trigger',
      },
      {
        documentation: 'https://octoblu-designer.readme.io/docs/template',
        id: '5b5bfdf0-3993-11e6-a61c-632f7ee1688a',
        name: 'Template',
        type: 'operation:Template',
      },
    ]
    let sut
    const handleChangeSpy = sinon.spy()
    beforeEach(() => {
      sut = mount(<BluprintManifestList manifest={manifest} onChange={handleChangeSpy} />)
    })

    it('should render a header', () => {
      expect(sut).to.contain.text('Things Manifest')
    })

    it('should render a toggle display button', () => {
      expect(sut.containsMatchingElement(
        <Button kind="no-style" size="small">Show</Button>
      )).to.equal(true)
    })

    describe('when toggle display button is clicked', () => {
      it('should call the onChange prop', () => {
        const toggleDisplayButton = sut.find({ children: 'Show' })
        toggleDisplayButton.simulate('click')

        expect(handleChangeSpy).to.have.been.called
      })
    })

    describe('when expanded prop is not provided', () => {
      it('should render a toggle button with "Show" text', () => {
        expect(sut.containsMatchingElement(
          <Button kind="no-style" size="small">Show</Button>
        )).to.equal(true)
      })

      it('should not render the manifest list', () => {
        manifest.forEach((node) => {
          expect(sut).to.not.contain(
            <DeviceIcon
              type={node.type}
              className={styles.GridListItemImage}
            />
          )
        })
      })
    })

    describe('when expanded prop is truthy', () => {
      beforeEach(() => {
        sut = shallow(<BluprintManifestList manifest={manifest} expanded />)
      })

      it('should render a toggle button with "Hide" text', () => {
        expect(sut.containsMatchingElement(
          <Button kind="no-style" size="small">Hide</Button>
        )).to.equal(true)
      })

      it('should render a manifest list', () => {
        manifest.forEach((node) => {
          expect(sut).to.contain(
            <DeviceIcon
              type={node.type}
              className={styles.GridListItemImage}
            />
          )
        })
      })
    })
  })
})
