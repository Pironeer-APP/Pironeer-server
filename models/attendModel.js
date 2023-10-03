const db = require('../config/db.js');

module.exports = {
  getCode: async () => {
    const query = 'SELECT * FROM Code';
    const codes = await db.query(query);

    return codes[0][0];
  },
  generateCode: async () => {
    const randomCode = Math.floor(Math.random() * 9000 + 1000); //1000과 9999사이
    const query = 'INSERT INTO Code(code) VALUES (?)';
    const code = await db.query(query, [randomCode]);

    return code[0][0];
  },
  addTempAttend: async (user_id, type) => {
    const query = `
    INSERT INTO TempAttend(user_id, type)
    VALUES(?, ?);`;

    const result = await db.query(query, [user_id, type]);
    return result[0];
  },
  getSessionAttend: async (session_id) => {
    // 조회 시 현재 세션에 해당하는 오늘의 확정된 출결 가져오기
    const query = 'SELECT * FROM Attend WHERE session_id=? AND DATE_FORMAT(created_at, "%Y-%m-%d")=CURDATE();';

    const attends = await db.query(query, [session_id]);

    return attends[0];
  },
  addFirstAttend: async (session_id) => {
    // 오늘의 TempAttend에 없는 결석한 사람들 user_id 가져오기
    const getAbsentUserId = `
    SELECT user_id
    FROM User
    WHERE user_id NOT IN (
      SELECT user_id
      FROM TempAttend
      WHERE DATE_FORMAT(created_at, "%Y-%m-%d")=CURDATE());`;
    // 오늘의 TempAttend에 있는 출석한 사람들 데이터 가져오기
    const getTempAttend = 'SELECT * FROM TempAttend WHERE DATE_FORMAT(created_at, "%Y-%m-%d")=CURDATE();';

    // Attend 테이블에 정보 복제
    const insertAttend = 'INSERT INTO Attend(user_id, session_id, type) VALUES(?, ?, ?);';

    const absentUserIdList = await db.query(getAbsentUserId);
    const tempAttendList = await db.query(getTempAttend);

    try {
      for (let tempAttend of tempAttendList[0]) {
        await db.query(insertAttend, [tempAttend.user_id, session_id, '출석']);
      }
      for (let absentUserId of absentUserIdList[0]) {
        await db.query(insertAttend, [absentUserId.user_id, session_id, '결석']);
      }
      return true;
    } catch (error) {
      return error;
    }
  },
  addNextAttend: async (session_id, part) => {
    // 두 번째와 세 번째 함수의 차이점이 크지 않아 하나로 합침
    const standard = {
      attend_type2: part === 2 ? '결석' : '지각',
      temp_attend_type2: part === 2 ? '출석' : '결석',
      final_type2: part === 2 ? '지각' : '결석'
    }
    // final_attend 도출
    const query = `
    SELECT Attend.user_id, Attend.type, TempAttend.type, Attend.created_at, TempAttend.created_at,
    CASE
      WHEN Attend.type='출석' AND TempAttend.type='결석'
      THEN '지각'
      WHEN Attend.type='${standard.attend_type2}' AND TempAttend.type='${standard.temp_attend_type2}'
      THEN '${standard.final_type2}'
      ELSE Attend.type
    END AS final_attend
    FROM Attend
    JOIN
    TempAttend
    ON Attend.user_id=TempAttend.user_id AND DATE_FORMAT(Attend.created_at, "%Y-%m-%d")=CURDATE()
    WHERE session_id=?
    AND DATE_FORMAT(TempAttend.created_at, "%Y-%m-%d")=CURDATE();`;
    // Attend 테이블 update
    const updateAttend = `
    UPATE Attend
    SET type=?
    WHERE user_id=? AND session_id=?;`;
    // TempAttend 테이블 삭제
    const clearTempAttend = `DELETE FROM TempAttend;`;

    try {
      const result = await db.query(query, [session_id]);
      for (let attendInfo of result[0]) {
        await db.query(updateAttend, [attendInfo.final_attend, attendInfo.user_id, session_id]);
      }
      await db.query(clearTempAttend);
      return true;
    } catch (error) {
      return false;
    }
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
  }
}