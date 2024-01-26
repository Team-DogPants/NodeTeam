const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join); 

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

router.post('/logout', isLoggedIn, logout);

router.get('/kakao', passport.authenticate('kakao'));

router.get('/naver', passport.authenticate('naver'));

router.get('/google', passport.authenticate('google'));

router.get('/kakao/callback', passport.authenticate('kakao',{
  failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/');
});

router.get('/naver/callback', passport.authenticate('naver',{
  failureRedirect: '/?error=네이버로그인 실패',
}), (req, res) => {
  res.redirect('/');
});

router.get('/google/callback', passport.authenticate('google',{
  failureRedirect: '/?error=구글로그인 실패',
}), (req, res) => {
  res.redirect('/');
});


module.exports = router;