const { User, Post, Hashtag } = require('../models');

exports.renderProfile = (req, res) => {
  res.render('profile', { title: '내 정보' });
};

exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원 가입' });
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,    // 모델
        attributes: ['id', 'nick'],   // 추출할 컬럼명
      },
      order: [['createdAt', 'DESC']],     // oreder문 생성날짜 내림차순
    });
    res.render('main', {
      title: 'DogPants',
      twits: posts,
    });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
}

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: {title: query}});
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }]});
    }
    return res.render('main', {
      title: `${query} | DogPants`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}