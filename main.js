const express = require('express');

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

///static 설정
app.use('/uploads', express.static('uploads'));

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const authRouter = require('./routers/authRouter.js');
const adminRouter = require('./routers/adminRouter.js');
const assignRouter = require('./routers/assignRouter.js');
const postRouter = require('./routers/postRouter.js');
const depositRouter = require('./routers/depositRouter.js');
const userRouter = require('./routers/userRouter.js');
const sessionRouter = require('./routers/sessionRouter.js');
const attendRouter = require('./routers/attendRouter.js');

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/assign', assignRouter);
app.use('/api/post', postRouter);
app.use('/api/deposit', depositRouter);
app.use('/api/user', userRouter);
app.use('/api/session', sessionRouter);
app.use('/api/attend', attendRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});