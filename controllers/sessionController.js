const sessionModel = require('../models/sessionModel');
const jwt = require('jsonwebtoken');
const getNextScheduleIdx = require('../reusable/getNextScheduleIdx');

module.exports = {
  addSchedule: async (req, res) => {
    const { title, date, face, place } = req.body;
    const mySQLDateString = date.slice(0, 19).replace('T', ' ');
    console.log('서버가 받은 date', date);
    console.log('서버가 받은 date 가공', mySQLDateString);
    const userInfo = req.body.account;
    // 관리자만 세션 일정 등록 가능
    // 관리자 level 기수 일정 등록
    if (userInfo.is_admin) {
      const result = await sessionModel.addSchedule(title, mySQLDateString, face, place, userInfo.level);
      res.json({ result: result });
    }
  },
  deleteSchedule: async (req, res) => {
    const { session_id } = req.body;
    const userInfo = req.body.account;
    if (userInfo.is_admin) { // 관리자만 일정 삭제 가능
      const result = await sessionModel.deleteSchedule(session_id);

      return res.json({ result: result });
    }
    console.log('[세션 일정 삭제 실패]');
    return res.json({ result: false });
  },
  getSessions: async (req, res) => {
    const userInfo = req.body.account;
    const sessions = await sessionModel.getSessions(userInfo.level);

    res.json({ sessions: sessions });
  },
  getWeekSessions: async (req, res) => {
    const userInfo = req.body.account;
    const sessions = await sessionModel.getWeekSessions(userInfo.level);

    const weekSessions = [];
    if (sessions.length > 0) {
      let weekIdx = 0;
      let standardYear = Number(sessions[0].year);
      let standardMonth = Number(sessions[0].month);
      let standardDate = Number(sessions[0].day);
      weekSessions.push([sessions[0]]); // 첫 번째 리스트 만들어 줌
      for (let i = 1; i < sessions.length; i++) {
        const month = Number(sessions[i].month);
        const day = Number(sessions[i].day);
        // 당월 7일 이내
        if (standardMonth === month && standardDate + 7 > day) {
          weekSessions[weekIdx].push(sessions[i]);
        } else if (standardMonth + 1 === month) {
          // 익월 7일 이내
          const last = new Date(standardYear, standardMonth, 0);
          const lastDay = last.getDate();
          if (standardDate + 7 > day + lastDay) {
            weekSessions[weekIdx].push(sessions[i]);
          } else {
            weekIdx += 1;
            standardYear = Number(sessions[i].year);
            standardMonth = Number(sessions[i].month);
            standardDate = Number(sessions[i].day);
            weekSessions.push([sessions[i]]); // 새로운 리스트 만들어 줌
          }
        } else {
          weekIdx += 1;
          standardYear = Number(sessions[i].year);
          standardMonth = Number(sessions[i].month);
          standardDate = Number(sessions[i].day);
          weekSessions.push([sessions[i]]); // 새로운 리스트 만들어 줌
        }
      }
    }

    res.json({ sessions: weekSessions });
  }
}