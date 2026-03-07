const session = require("express-session");
const redisClient = require("@/plugin/redis");
const serverConfig = require("@/config");
const { RedisStore } = require("connect-redis");
const sessionMiddleware = session({
  store: new RedisStore({
    client: redisClient,
    prefix: serverConfig.session.prefix,
    ttl: serverConfig.session.ttl,
  }),
  secret: serverConfig.session.secret,
  name: serverConfig.cookie.name,
  rolling: serverConfig.session.rolling,
  resave: serverConfig.session.resave,
  saveUninitialized: serverConfig.session.saveUninitialized,
  cookie: {
    httpOnly: serverConfig.cookie.httpOnly,
    secure: serverConfig.cookie.secure,
    maxAge: serverConfig.cookie.maxAge,
  },
});

module.exports = sessionMiddleware;
