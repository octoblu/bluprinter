import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import { PageActions } from 'zooid-ui'

const propTypes = {
  deleting: PropTypes.bool,
  onDeleteBluprint: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onUpdateVersion: PropTypes.func.isRequired,
  updating: PropTypes.bool,
}

const defaultProps = {
  deleting: false,
  updating: false,
}

const BluprintDetailPageActions = ({ deleting, onDeleteBluprint, onImport }) => {
  let deleteButtonText = 'Delete'
  if (deleting) deleteButtonText = 'Deleting...'

  return (
    <PageActions>
      <Button onClick={onImport} kind="primary" disabled={false}>
        Import
      </Button>

      <Button onClick={onDeleteBluprint} kind="hollow-danger" disabled={false}>
        {deleteButtonText}
      </Button>
    </PageActions>
  )
}

BluprintDetailPageActions.propTypes    = propTypes
BluprintDetailPageActions.defaultProps = defaultProps

export default BluprintDetailPageActions
