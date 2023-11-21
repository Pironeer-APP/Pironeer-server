const request = require("supertest");
const server = require('../main.js');
const db = require("../config/db.js");
const jwt = require('jsonwebtoken');

beforeEach(async () => {
  await db.query('INSERT INTO User(user_id, level, name, phone, password, email, deposit) VALUES(1000, 20, "test", "010-5555-5555", "test", "test@gmail.com", 12000);');
})
afterEach(async () => {
  await db.query('DELETE FROM User WHERE name="test" AND phone="010-5555-5555";');
  await db.end();
  server.close();
})

test("[회원탈퇴테스트] 탈퇴 성공 시 쿼리 결과 객체, 실패 시 false가 json으로 반환됩니다", async () => {
  try {
    const jwtToken = jwt.sign({user_id: 1000}, process.env.JWT);
    console.log(jwtToken);
    const response = await request(server).post("/api/auth/unregister").send({token: jwtToken});
    console.log(response.body)
    expect(response.body).not.toEqual({});
  } catch(error) {
    console.log(error);
  }
});