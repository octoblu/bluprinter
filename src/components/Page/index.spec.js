import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'
import { ErrorState } from 'zooid-ui'
import Heading from 'zooid-heading'
import Spinner from 'zooid-spinner'
import Toast from 'zooid-toast'

import Page from './'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<Page />', () => {
  describe('when given a title as prop', () => {
    it('should render the title', () => {
      const sut = shallow(<Page title="Alicia Keys" />)
      expect(sut).to.contain(<Heading level={2}>Alicia Keys</Heading>)
    })
  })

  describe('when loading prop is truthy', () => {
    it('should display a spinner', () => {
      const sut = shallow(<Page loading />)
      expect(sut).to.contain(<Spinner />)
    })
  })

  describe('when given an error prop', () => {
    it('should render an <ErrorState />', () => {
      const sut = shallow(<Page error={new Error('Bruh...')} />)
      expect(sut).to.contain(<ErrorState title="Oops..." description="Bruh..." />)
    })
  })

  describe('when given children', () => {
    it('should render the children', () => {
      const sut = shallow(<Page><div>Some text</div></Page>)
      expect(sut).to.contain(<div>Some text</div>)
    })
  })

  describe('when given a toast prop', () => {
    it('should render the toast with a message', () => {
      const sut = shallow(<Page toast="Samsonite Man" />)
      expect(sut).to.contain(<Toast message="Samsonite Man" />)
    })
  })
})
