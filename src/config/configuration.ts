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
});
