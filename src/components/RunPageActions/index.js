import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import { PageActions } from 'zooid-ui'

const propTypes = {
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  online: PropTypes.bool,
}

const RunPageActions = ({ onStop, onStart, online }) => {
  const stopOrStartButton = () => {
    if(online) return <Button onClick={onStop} kind="hollow-danger" size="small">Stop</Button>
    return <Button onClick={onStart} kind="hollow-approve" size="small">Start</Button>
  }

  return (
    <div>
      <PageActions>
        {stopOrStartButton()}
      </PageActions>
    </div>
  )
}

RunPageActions.propTypes = propTypes

export default RunPageActions
