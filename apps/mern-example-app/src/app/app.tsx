import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserManager } from 'oidc-client';
import { UserState } from 'redux-oidc';
import { GoAButton, GoaHeader, GoaHeroBanner } from '@abgov/react-components';

import styles from './app.module.css';
import '@abgov/core-css/goa-core.css';
import '@abgov/core-css/goa-components.css';
import '@abgov/react-components/react-components.esm.css';
import {
  fetchPrivateResource,
  fetchPublicResource,
  publicResourceSelector,
  privateResourceSelector,
} from './start.slice';

interface AppProps {
  userManager: UserManager;
}

export function App({ userManager }: AppProps) {
  const user = useSelector((state: { user: UserState }) => state.user.user);
  const publicResource = useSelector(publicResourceSelector);
  const privateResource = useSelector(privateResourceSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublicResource());
    if (user?.access_token) {
      dispatch(fetchPrivateResource(user?.access_token));
    }
  }, [user, dispatch]);

  return (
    <div className={styles.app}>
      <GoaHeader
        serviceLevel="alpha"
        serviceName="Digital Service Example"
        serviceHome="/"
      />
      <GoaHeroBanner
        title="Quick start of a digital service"
        backgroundUrl={'../assets/banner.jpg'}
      />
      <main>
        <section>
          <h2>Welcome to mern-example-app!</h2>
          <p>
            Don't panic. Start editing the project to build your digital
            service.
          </p>
          <h3>A few things you might want to do next:</h3>
          <ul className={styles.nextSteps}>
            <li>
              Create the 'mern-example-app' client in your realm to let users
              {user ? (
                <GoAButton onClick={() => userManager.signoutRedirect()}>
                  Sign Out
                </GoAButton>
              ) : (
                <GoAButton onClick={() => userManager.signinRedirect()}>
                  Sign In
                </GoAButton>
              )}
            </li>
            <li>
              Make requests to the backend API by either updating nginx.conf or
              enabling CORS on the API.
            </li>
            <li>
              Add requests to public API resources:{' '}
              {publicResource || 'Not retrieved'}
            </li>
            <li>
              Add requests to private API resources:{' '}
              {privateResource || 'Not retrieved'}
            </li>
          </ul>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className="goa-socialconnect">
          <div className="goa-title">Connect with us on</div>
          <ul>
            <li className={styles.github}>
              <a
                href="https://github.com/abgov"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
