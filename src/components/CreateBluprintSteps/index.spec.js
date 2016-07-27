import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import MdDone from 'react-icons/lib/md/done'
import MdRadioButtonUnchecked from 'react-icons/lib/md/radio-button-unchecked'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { mount, shallow } from 'enzyme'

import CreateBluprintSteps from './'
import styles from './styles.css'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('<CreateBluprintSteps />', () => {
  describe('when given a list of items', () => {
    xit('should render all items in the list', () => {
      const steps = [
        {
          label: 'Create a Bluprint',
          state: 'DONE'
        },
        {
          label: 'Configure',
          state: 'ACTIVE'
        },
        {
          label: 'Finish',
        },
      ]

      const sut = shallow(<CreateBluprintSteps steps={steps} />)

      expect(sut).to.contain(
        <div className={styles.root}>
          <div className={styles.completedStep}>Create a Bluprint <MdDone /></div>
          <div className={styles.activeStep}>Configure <MdRadioButtonUnchecked /></div>
          <div className={styles.step}>Finish <MdRadioButtonUnchecked /></div>
        </div>
      )
    })
  })
})
