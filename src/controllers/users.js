require('dotenv').config()

const express = require('express')
const models = require('../repositories');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const router = express.Router()
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_KEY;

router.post('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json("Only admin can perform this action");
    }
    
    try {
        const user = await models.User.create(req.body)
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json("Only admin can access this information");
    }
    
    try {
        const user = await models.User.findAll()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.put('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.id != userId && req.user.role !== "admin") {
            return res.status(403).json("You can only update your own info");
        }

        if (req.user.role !== "admin") {
            req.body.role = ""
        }

        const [ updated ] = await models.User.update(req.body, {
            where: { id: userId }
        });
        if (updated) {
            const updatedUser = await models.User.findOne({ where: { id: userId } });
            return res.status(200).json(updatedUser);
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.get('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.id != userId && req.user.role !== "admin") {
            return res.status(403).json("You can only view your own info");
        }
    
        const updatedUser = await models.User.findOne({ where: { id: userId } });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => { 
    const { email, password } = req.body;
    console.log(email, password)
    if (email && password) {
      var user = await models.User.findOne({ where: { email: email } });
      if (!user) {
        res.status(401).json({ msg: 'No such user found', user });
      }
     if (user.password === password) {
        var payload = { id: user.id, role: user.role };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ msg: 'ok', token: token });
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    }
});

module.exports = router;
