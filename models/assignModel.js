const db = require('../config/db.js');

module.exports = {
    showAssign: async (curUserLevel, curUserId) => {
        const query = `
        SELECT assignshedule_id, title, due_date, created_at
        FROM AssignSchedule
        WHERE level=? AND category=?;
        JOIN
        SELECT grade, assignschedule_id
        FROM Assign
        WHERE user_id=?`;
        const AssignData = await db.query(query, [curUserLevel, 1, curUserId]); // 회원의 기수, 과제 카테고리, 회원 식별자로 필터링
        const Assign = AssignData[0];
        return Assign;
    }
}