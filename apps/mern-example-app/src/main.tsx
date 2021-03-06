import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  CallbackComponent,
  loadUser,
  OidcProvider,
  reducer as oidcReducer,
  SignoutCallbackComponent,
} from 'redux-oidc';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { environment } from './environments/environment';
import { START_FEATURE_KEY, startReducer } from './app/start.slice';
import { INTAKE_FEATURE_KEY, intakeReducer } from './app/intake.slice';
import { createUserManager } from './access';
import App from './app/app';

const store = configureStore({
  reducer: {
    user: oidcReducer,
    [START_FEATURE_KEY]: startReducer,
    [INTAKE_FEATURE_KEY]: intakeReducer,
  },
  // Additional middleware can be passed to this array
  middleware: [...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== 'production',
  // Optional Redux store enhancers
  enhancers: [],
});

// Fetch configuration from web server; otherwise fallback to static environment.
fetch('/config/config.json')
  .then((res) => (res.ok ? res.json() : environment))
  .then(({ access }) => {
    const userManager = createUserManager(access);
    loadUser(store, userManager);

    ReactDOM.render(
      <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
          <React.StrictMode>
            <Router>
              <Switch>
                <Route
                  path="/auth/callback"
                  render={({ history }) => (
                    <CallbackComponent
                      userManager={userManager}
                      successCallback={() => history.push('/')}
                      errorCallback={() => history.push('/')}
                    >
                      <span>signing in...</span>
                    </CallbackComponent>
                  )}
                />
                <Route
                  path="/signout/callback"
                  render={({ history }) => (
                    <SignoutCallbackComponent
                      userManager={userManager}
                      successCallback={() => history.push('/')}
                      errorCallback={() => history.push('/')}
                    >
                      <span>signing out...</span>
                    </SignoutCallbackComponent>
                  )}
                />
                <Route>
                  <App userManager={userManager} />
                </Route>
              </Switch>
            </Router>
          </React.StrictMode>
        </OidcProvider>
      </Provider>,
      document.getElementById('root')
    );
  });
