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
//
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const authRouter = require('./routers/authRouter.js');
const adminRouter = require('./routers/adminRouter.js');
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

const depositRouter = require('./routers/depositRouter.js');
app.use('/deposit', depositRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});