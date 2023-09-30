const express = require('express');
const multer = require('multer');

const app = express();
const port = 3000;

//cors 설정
const cors = require('cors');
// const corsOptions = {
//   origin: 'http://localhost',
//   credentials: true,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));
app.use(cors());

//multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/notice')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({storage: storage}) //storage 설정을 사용하는 upload라는 이름의 multer 미들웨어 인스턴스 생성

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const authRouter = require('./routers/authRouter.js');
const adminRouter = require('./routers/adminRouter.js');
const postRouter = require('./routers/postRouter.js');
const depositRouter = require('./routers/depositRouter.js');
const userRouter = require('./routers/userRouter.js');
const sessionRouter = require('./routers/sessionRouter.js');
const attendRouter = require('./routers/attendRouter.js');
app.use('/api/auth', authRouter); 
app.use('/api/admin', adminRouter);
app.use('/api/post', postRouter);
app.use('/api/deposit', depositRouter);
app.use('/api/user', userRouter);
app.use('/api/session', sessionRouter);
app.use('/api/code', attendRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});