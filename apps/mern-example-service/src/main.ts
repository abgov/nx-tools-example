/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as express from 'express';
import * as passport from 'passport';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import { AccessUser, createAccessStrategy } from './access';

import { environment } from './environments/environment';

passport.use('jwt', createAccessStrategy(environment));
passport.use('anonymous', new AnonymousStrategy());

const app = express();
app.use(passport.initialize());
app.use(passport.authenticate(['jwt', 'anonymous'], { session: false }));

app.get('/mern-example-service/v1/public', (_req, res) => {
  res.send({ message: `Welcome to public API resource!` });
});

app.get(
  '/mern-example-service/v1/private',
  (req, res, next) => {
    if (!req.user) {
      res.sendStatus(401);
    } else {
      next();
    }
  },
  (req, res) => {
    const user = req.user as AccessUser;
    res.send({ message: `Welcome to private API resource! ${user.name}` });
  }
);

const port = environment.port || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/mern-example-service/v1`);
});
server.on('error', console.error);
