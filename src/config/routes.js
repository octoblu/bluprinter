import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from '../containers/app';
import Home from '../containers/home';
import CreateBluprint from '../containers/create-bluprint';
import ImportBluprint from '../containers/import-bluprint';

import NotFound from '../components/NotFound';

import { storeAuthenticationAndRedirect } from '../services/auth-service';

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/auth/callback" onEnter={storeAuthenticationAndRedirect} />
      <Route path="flows/:uuid/new" component={CreateBluprint} />
      <Route path="bluprints/:uuid/import" component={ImportBluprint} />
    </Route>
    <Route path="*" status={404} component={NotFound} />
  </Route>
);
