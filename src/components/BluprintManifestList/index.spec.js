import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'
import List, { ListItem } from 'zooid-list'

import BluprintManifestList from './'

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
    it('should render each node in the manifest list', () => {
      const manifest = [
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

      const sut = shallow(<BluprintManifestList manifest={manifest} />)
      expect(sut.find(ListItem).length).to.equal(2)
    })
  })
})
