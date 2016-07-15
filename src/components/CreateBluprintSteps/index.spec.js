import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import CreateBluprintSteps from './'
import styles from './styles.css'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<CreateBluprintSteps />', () => {
  describe('when given a list of items', () => {
    it('should render all items in the list', () => {
      const steps = [
        {
          label: 'Create a Bluprint',
          state: 'COMPLETED'
        },
        {
          label: 'Configure',
          state: 'ACTIVE'
        },
        {
          label: 'Finish',
        },
      ]

      const sut = mount(<CreateBluprintSteps steps={steps} />)

      expect(sut).to.contain(
        <div className={styles.root}>
          <div className={styles.completedStep}>Create a Bluprint</div>
          <div className={styles.activeStep}>Configure</div>
          <div className={styles.step}>Finish</div>
        </div>
      )
    })
  })
})
