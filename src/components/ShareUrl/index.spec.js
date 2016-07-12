import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { shallow } from 'enzyme'

import ShareUrl from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<ShareUrl />', () => {
  describe('when given a uuid, callback, and public boolean', () => {
    let sut
    beforeEach(() => {
      const handlePublic = sinon.spy()
      sut = shallow(
        <ShareUrl uuid="this-uuid" onChange={handlePublic} publicBluprint={false} />
      )
    })

    xit('should generate the share url', () => {
      expect(sut.containsMatchingElement(
        <a href="https://bluprinter.octoblu.com/bluprints/this-uuid/import" >
        https://bluprinter.octoblu.com/bluprints/this-uuid/import
        </a>
      )).to.equal(true)
    })
  })
})
