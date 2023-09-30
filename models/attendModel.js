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
    // 조회 시 현재 세션에 해당하는 확정된 출결 가져오기
    const query = 'SELECT * FROM Attend WHERE session_id=?;';

    const attends = await db.query(query, [session_id]);

    return attends[0];
  },
  addFirstAttend: async (session_id) => {
    // TempAttend에 없는 결석한 사람들 user_id 가져오기
    const getAbsentUserId = 'SELECT user_id FROM User WHERE user_id NOT IN (SELECT user_id FROM TempAttend);';
    // TempAttend에 있는 출석한 사람들 데이터 가져오기
    const getTempAttend = 'SELECT * FROM TempAttend;';

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
    ON Attend.user_id=TempAttend.user_id
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
}