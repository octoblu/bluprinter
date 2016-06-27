import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import { PageActions } from 'zooid-ui'

const propTypes = {
  onUpdateVersion: PropTypes.func.isRequired,
  updating: PropTypes.bool,
}

const defaultProps = {
  updating: false,
}

const BluprintDetailPageActions = ({ onUpdateVersion, updating }) => {
  let buttonText = 'Update Version'
  if (updating) buttonText = 'Updating...'

  return (
    <PageActions>
      <Button
        onClick={onUpdateVersion}
        kind="hollow-neutral"
        size="small"
        disabled={updating}
        id="updateVersionBtn"
      >
        {buttonText}
      </Button>
    </PageActions>
  )
}

BluprintDetailPageActions.propTypes    = propTypes
BluprintDetailPageActions.defaultProps = defaultProps

export default BluprintDetailPageActions
