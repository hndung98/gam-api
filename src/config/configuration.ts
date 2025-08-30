export default () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
  },
  adminInfo: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
  googleAds: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    developerToken: process.env.GOOGLE_DEVELOPER_TOKEN,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    loginCustomerId: process.env.GOOGLE_LOGIN_CUSTOMER_ID,
  },
});
