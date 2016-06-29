import React, { PropTypes } from 'react'
import { ErrorState } from 'zooid-ui'
import Heading from 'zooid-heading'
import Spinner from 'zooid-spinner'
import Toast from 'zooid-toast'

const propTypes = {
  children: PropTypes.node,
  error: PropTypes.object,
  loading: PropTypes.bool,
  title: PropTypes.string,
  toast: PropTypes.string,
}

const defaultProps = {}

const Page = ({ children, error, loading, title, toast }) => {
  return (
    <div>
      {title && <Heading level={2}>{title}</Heading>}
      {loading && <Spinner size="large" />}
      {error && <ErrorState title="Oops..." description={error.message} />}

      {children}
      <Toast message={toast} />
    </div>
  )
}

Page.propTypes    = propTypes
Page.defaultProps = defaultProps

export default Page
