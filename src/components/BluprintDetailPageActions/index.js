import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import { PageActions } from 'zooid-ui'

const propTypes = {
  onUpdateVersion: PropTypes.func.isRequired
}
const defaultProps = {}

const BluprintDetailPageActions = ({ onUpdateVersion }) => {
  return (
    <PageActions>
      <Button
        onClick={onUpdateVersion}
        id="updateVersionBtn"
      >
        Update Version
      </Button>
    </PageActions>
  )
}

BluprintDetailPageActions.propTypes    = propTypes
BluprintDetailPageActions.defaultProps = defaultProps

export default BluprintDetailPageActions
