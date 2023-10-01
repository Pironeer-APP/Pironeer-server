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
    const query = 'SELECT * FROM Session WHERE level=? ORDER BY date desc;';
    const sessions = await db.query(query, [level]);
    
    return sessions[0];
  },
  getWeekSessions: async (level) => {
    const query = 'SELECT *, DATE_FORMAT(date, "%m") AS month, DATE_FORMAT(date, "%d") AS day FROM Session WHERE level=? ORDER BY date;';
    const sessions = await db.query(query, [level]);
    
    return sessions[0];
  },
}