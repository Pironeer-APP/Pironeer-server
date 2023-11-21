const mailer = require('../nodemailer/mailer.js');

test('nodemailer 메일 전송을 테스트합니다', async () => {
  const body = {
    email: 'ywonchae62@gmail.com',
    name: '양원채',
    phone: '010-3359-8149',
  }
  const randPassword = '12341234';
  const mailerResult = await mailer(body.email, body.name, body.phone, randPassword);
  await expect(mailerResult.result).toBe(true);
})