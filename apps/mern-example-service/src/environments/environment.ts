export const environment = {
  production: false,
  port: '3333',
  TENANT_REALM: 'core',
  ACCESS_SERVICE_URL: 'https://access-uat.alpha.alberta.ca',
  ...process.env,
};
