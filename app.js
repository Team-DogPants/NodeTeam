const express = require('express'); // 웹서버
const cookieParser = require('cookie-parser');  // 쿠키
const morgan = require('morgan'); // 미들웨업 사용
const path = require('path'); // 경로 사용
const session = require('express-session'); // 세션
const nunjucks = require('nunjucks'); // 화면 템플릿 타임리프
const dotenv = require('dotenv'); // 세션이랑 쿠키에서 사용하려고 .env 파일 생성
const passport = require('passport');

dotenv.config();  // .env 설정

const pageRouter = require('./routes/page');  // 라우터 설정
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
//const reactRouter = require('./routes/about');
const { sequelize } = require('./models');
const passportConfig = require('./passport')

const app = express();  // express 사용할 것 만듬.

passportConfig();

app.set('port', process.env.PORT || 8001); // 포트 번호 설정
app.set('view engine', 'html'); // 화면 엔진 -> html
nunjucks.configure('views', {  // Nunjucks 설정 html -> views 폴더 안에
  express: app,
  watch: true,
});

sequelize.sync({ force: false })
.then(() => {
  console.log('데이터베이스 연결 성공');
})
.catch((err) => {
  console.error(err);
});

app.use(morgan('dev')); // 미들웨어 설정 'dev
app.use(express.static(path.join(__dirname, 'public')));  // 정적 폴더 css 들어간다.
//app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());  // 웹 json 설정
app.use(express.urlencoded({ extended: false })); // 웹 url 인코더 설정
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 설정
app.use(session({ // 세션 설정
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter); // "/" => ./routes/page
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use(express.static(path.join(__dirname, 'reactclient/build')));

app.get('/about', function(req,res){
  res.sendFile(path.join(__dirname, 'reactclient/build/index.html'))
});

// 에러 404
app.use((req, res, next) => {
  const error = new Error(`${req.method}${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 500
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// 듣는 애 -> 클라이언트 듣는 애
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});