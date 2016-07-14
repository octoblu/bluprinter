import React from 'react'
import { Router, Route } from 'react-router'

import App from '../containers/App'
import BluprintDetail from '../containers/BluprintDetail'
import CreateBluprint from '../containers/CreateBluprint'
import Home from '../containers/Home'
import ImportBluprint from '../containers/ImportBluprint'
import Logout from '../containers/Logout'
import NotFound from '../containers/NotFound'
import RunIotApp from '../containers/RunIotApp'

import { storeAuthenticationAndRedirect } from '../services/auth-service'

export default ({ history }) => {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="auth/callback" onEnter={storeAuthenticationAndRedirect} />
        <Route path="flows/:flowUuid/new" component={CreateBluprint} />
        <Route path="bluprints/:uuid" component={BluprintDetail} />
        <Route path="bluprints/:uuid/import" component={ImportBluprint} />
        <Route path="app/:uuid" component={RunIotApp} />
        <Route path="/logout" component={Logout} />
      </Route>

      <Route path="home" component={Home} />
      <Route path="*" status={404} component={NotFound} />
    </Router>
  )
}
