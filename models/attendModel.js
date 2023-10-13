const db = require('../config/db.js');
const sessionModel = require('./sessionModel.js');

module.exports = {
  getCode: async () => {
    const query = 'SELECT * FROM Code';
    const codes = await db.query(query);

    return codes[0][0];
  },
  generateCode: async () => {
    let randomCode = '';
    for(let i = 0; i < 4; i++) randomCode += String(Math.floor(Math.random() * 10));
    const query1 = 'INSERT INTO Code(code) VALUES (?)';
    await db.query(query1, [randomCode]);

    return randomCode;
  },
  addTempAttend: async (user_id, type) => {
    const query = `
    INSERT INTO TempAttend(user_id, type)
    VALUES(?, ?);`;

    const result = await db.query(query, [user_id, type]);
    return result[0];
  },
  // 코드에 따라 출결 삭제
  deleteTempAttend: async (deleteCode) => {
    const query = `
    DELETE FROM TempAttend
    WHERE code=?;`;

    const result = await db.query(query, [deleteCode]);
    if(result[0].affectedRows > 0) {
      return '삭제 완료';
    }
    return '코드 없음';
  },
  getSessionAttend: async (session_id) => {
    // 조회 시 현재 세션에 해당하는 오늘의 확정된 출결 가져오기
    const query = 'SELECT * FROM Attend WHERE session_id=?;';

    const attends = await db.query(query, [session_id]);

    return attends[0];
  },
  // 오늘 출결 종료
  endAttend: async (session_id) => {
    /*
    1. mysql utc 시간에 따라 오늘 세션 정보 조회
    2. TempAttend 테이블 조회, 출결 사항 집계
    3. 하나의 user_id가 출석 데이터를 4개 이상 가지고 있다면 잘못된 출결
    4. user 별 출석 데이터 3개: 출석, 2개: 지각, 1개 이하: 결석
    */
    const query = `
    SELECT IF(COUNT(user_id)>3, 'false', 'true') AS attend_cnt FROM TempAttend GROUP BY user_id;`;

    const insert_query = `
    INSERT INTO Attend
    (user_id, session_id, type)
    SELECT User.user_id AS user_id, ? AS session_id,
      CASE
      WHEN COUNT(User.user_id)=3
      THEN '출석'
      WHEN COUNT(User.user_id)=2
      THEN '지각'
      WHEN COUNT(User.user_id)<=1
      THEN '결석'
      WHEN COUNT(User.user_id)>3
      THEN '에러'
      END AS type
    FROM TempAttend
    RIGHT JOIN User
    ON User.user_id=TempAttend.user_id
    GROUP BY User.user_id;`;

    // 3번
    const cntTempAttend = await db.query(query);
    for(let tempAttend of cntTempAttend[0]) {
      if(tempAttend.attend_cnt === 'false') return false;
    }
    
    // Attend 테이블에 출결 데이터 확정
    await db.query(insert_query, [session_id]);
    return true;
  },
  getUserSessionAttend: async (user_id, session_id) => {
    const query = 'SELECT * FROM Attend WHERE user_id=? AND session_id=?;';
    const attend = await db.query(query, [user_id, session_id]);

    return attend[0][0];
  },
  updateAttend: async (user_id, attendType, session_id) => {
    console.log(user_id, attendType, session_id);
    const query = 'UPDATE Attend SET type=? WHERE user_id=? AND session_id=?;';
    const result = await db.query(query, [attendType, user_id, session_id]);

    return result[0];
  },
  getSessionAttendAdmin: async (level, session_id) => {
    const qurey = `
    SELECT User.user_id, Attend.session_id, User.name, User.level, User.is_admin, Attend.session_id, Attend.type
    FROM
    (
      SELECT * FROM Attend WHERE session_id=?
    ) AS Attend
    RIGHT JOIN
    (
      SELECT * FROM User WHERE level=? AND is_admin=0
    ) AS User
    ON Attend.user_id=User.user_id;`;

    const result = await db.query(qurey, [session_id, level]);

    return result[0];
  },
  getSessionAndAttend: async (user_id, level) => {
    const query = `
    SELECT
      ROW_NUMBER() OVER(ORDER BY Session.date DESC) AS cnt,
      Session.session_id, Session.level, Session.title, Session.location,
      Session.date, Session.is_face, Attend.attend_id, Attend.user_id, Attend.type,
      DATE_FORMAT(date, "%Y") AS year, DATE_FORMAT(date, "%m") AS month,
      DATE_FORMAT(date, "%d") AS day, DATE_FORMAT(date, "%w") AS day_of_week,
      DATE_FORMAT(date, "%H") AS hour, DATE_FORMAT(date, "%i") AS minute,
      DATE_FORMAT(date, "%s") AS second, DATE_ADD(date, INTERVAL 1 HOUR) AS date_plus_1h,
      CASE
        WHEN DATE_FORMAT(date, "%w")='0'
        THEN 'SUN'
        WHEN DATE_FORMAT(date, "%w")='1'
        THEN 'MON'
        WHEN DATE_FORMAT(date, "%w")='2'
        THEN 'TUE'
        WHEN DATE_FORMAT(date, "%w")='3'
        THEN 'WED'
        WHEN DATE_FORMAT(date, "%w")='4'
        THEN 'THU'
        WHEN DATE_FORMAT(date, "%w")='5'
        THEN 'FRI'
        WHEN DATE_FORMAT(date, "%w")='6'
        THEN 'SAT'
      END AS day_en
    FROM
    (
      SELECT *
      FROM Session
      WHERE level=?
    ) Session
    LEFT OUTER JOIN
    (
      SELECT *
      FROM Attend
      WHERE user_id=?
    ) Attend
    ON Session.session_id=Attend.session_id;`;

    const sessions = await db.query(query, [level, user_id]);

    return sessions[0];
  },
  getCode: async () => {
    const query = 'SELECT * FROM Code WHERE DATE_FORMAT(created_at, "%Y-%m-%d")=CURDATE() ORDER BY created_at DESC LIMIT 1;';
    const code = await db.query(query);

    return code[0][0];
  }
}