import * as jwksRsa from 'jwks-rsa';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

interface AccessStrategyProps {
  ACCESS_SERVICE_URL: string;
  TENANT_REALM: string;
}

export interface AccessUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export const createAccessStrategy = ({
  ACCESS_SERVICE_URL,
  TENANT_REALM,
}: AccessStrategyProps) => {
  const strategy = new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: `${ACCESS_SERVICE_URL}/auth/realms/${TENANT_REALM}/protocol/openid-connect/certs`,
        cache: true,
      }),
      issuer: `${ACCESS_SERVICE_URL}/auth/realms/${TENANT_REALM}`,
    },
    (payload, done) => {
      const user: AccessUser = {
        id: payload.sub,
        name: payload.name || payload.preferred_username,
        email: payload.email,
        roles: payload.realm_access.roles,
      };
      done(null, user);
    }
  );

  return strategy;
};
