import React from 'react'
import { IndexRoute, Router, Route } from 'react-router'

import App from '../containers/App'
import BluprintDetail from '../containers/BluprintDetail'
import UpdateBluprint from '../containers/UpdateBluprint'
import ConfigureBluprint from '../containers/ConfigureBluprint'
import FinishCreateBluprint from '../containers/FinishCreateBluprint'
import Home from '../containers/Home'
import ImportBluprint from '../containers/ImportBluprint'
import Logout from '../containers/Logout'
import NewBluprint from '../containers/NewBluprint'
import NotFound from '../containers/NotFound'
import RunIotApp from '../containers/RunIotApp'
import UpdatePermissions from '../containers/UpdatePermissions'

import CreateBluprintForm from '../components/CreateBluprintForm'

import { storeAuthenticationAndRedirect } from '../services/auth-service'

export default ({ history }) => {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="auth/callback" onEnter={storeAuthenticationAndRedirect} />
        <Route path="bluprints/new/:flowUuid" component={NewBluprint}>
          <IndexRoute component={CreateBluprintForm} />
        </Route>

        <Route path="bluprints/:bluprintUuid/update" component={UpdateBluprint}/>
        <Route path="bluprints/:bluprintUuid/configure" component={ConfigureBluprint} />
        <Route path="bluprints/:bluprintUuid/update-permissions" component={UpdatePermissions} />
        <Route path="bluprints/:bluprintUuid/finish" component={FinishCreateBluprint} />

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
