require('dotenv').config()

const express = require('express')
const app = express()
const port = 6900
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
const jwt = require('jsonwebtoken');
const models = require('./src/repositories');

const userRouter = require('./src/controllers/users')
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_KEY;

app.get('/', (req, res) => {
  res.send('OK!')
})

var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    var user = await models.User.findOne({ where: { id: jwt_payload.id } });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);
app.use(express.json())
app.use(passport.initialize());
app.use(userRouter)

app.listen(port, () => {
  console.log(`Hydra is listening at http://localhost:${port}`)
})
