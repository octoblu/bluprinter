import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Page from 'zooid-page'
const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  params: PropTypes.object,
}

class FinishCreateBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  componentDidMount(){
    const { dispatch, params } = this.props
    dispatch(getBluprint(params.bluprintUuid))
  }

  render() {
    return <div>FinishCreateBluprint</div>
  }
}

FinishCreateBluprint.propTypes    = propTypes
const mapStateToProps = ({ bluprint, flow, schemas }) => {
  return { bluprint, flow, schemas }
}
export default connect(mapStateToProps)(FinishCreateBluprint)
