import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import { PageActions } from 'zooid-ui'

const propTypes = {
  deleting: PropTypes.bool,
  onDeleteBluprint: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
}

const defaultProps = {
  deleting: false,
}

const BluprintDetailPageActions = ({ deleting, onDeleteBluprint, onImport }) => {
  let deleteButtonText = 'Delete'
  if (deleting) deleteButtonText = 'Deleting...'

  return (
    <PageActions>
      <Button onClick={onImport} kind="primary" disabled={false} size="small">
        Import
      </Button>

      <Button onClick={onDeleteBluprint} kind="hollow-danger" disabled={false} size="small">
        {deleteButtonText}
      </Button>
    </PageActions>
  )
}

BluprintDetailPageActions.propTypes    = propTypes
BluprintDetailPageActions.defaultProps = defaultProps

export default BluprintDetailPageActions
