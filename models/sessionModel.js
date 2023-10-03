const db = require('../config/db.js');

module.exports = {
  addSchedule: async (title, date, face, place, level) => {
    const query = `
    INSERT
    INTO Session(level, title, location, date, is_face)
    VALUES(?, ?, ?, ?, ?);`;
    const result = await db.query(query, [level, title, place, date, face]);

    return result[0]
  },
  deleteSchedule: async (session_id) => {
    const query = 'DELETE FROM Session WHERE session_id=?;';
    const result = await db.query(query, [session_id]);

    return result[0];
  },
  getSessions: async (level) => {
    const query = `
    SELECT *,
      ROW_NUMBER() OVER(ORDER BY Session.date DESC) AS cnt,
      DATE_FORMAT(date, "%Y") AS year, DATE_FORMAT(date, "%m") AS month, DATE_FORMAT(date, "%d") AS day, DATE_FORMAT(date, "%w") AS day_of_week,
      DATE_FORMAT(date, "%H") AS hour, DATE_FORMAT(date, "%i") AS minute, DATE_FORMAT(date, "%s") AS second, DATE_ADD(date, INTERVAL 1 HOUR) AS date_plus_1h,
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
    FROM Session
    WHERE level=?;`;
    const sessions = await db.query(query, [level]);
    
    return sessions[0];
  },
  getWeekSessions: async (level) => {
    const query = 'SELECT *, DATE_FORMAT(date, "%Y") AS year, DATE_FORMAT(date, "%m") AS month, DATE_FORMAT(date, "%d") AS day FROM Session WHERE level=? ORDER BY date;';
    const sessions = await db.query(query, [level]);
    
    return sessions[0];
  },
  getTodaySession: async () => {
    const query = 'SELECT * FROM Session WHERE DATE_FORMAT(date, "%Y-%m-%d")=CURDATE();';
    const session = await db.query(query);

    return session[0][0];
  }
}