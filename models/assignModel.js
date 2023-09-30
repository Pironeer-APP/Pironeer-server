const db = require('../config/db.js');

module.exports = {
    showAssign: async (curUserLevel, curUserId) => {
        const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY AssignSchedule.created_at) AS AssignId,
         AssignSchedule.title, AssignSchedule.due_date, AssignSchedule.created_at,
         Assign.grade,
         CASE
            WHEN AssignSchedule.due_date < CURDATE() THEN TRUE
            ELSE FALSE
         END AS done
        FROM
         AssignSchedule
        JOIN
         Assign
        ON
         AssignSchedule.assignschedule_id = Assign.assignschedule_id
        WHERE AssignSchedule.level = ? AND Assign.user_id = ?;`;
        const AssignData = await db.query(query, [curUserLevel, curUserId]); // 회원의 기수, 회원 식별자로 필터링
        const Assign = AssignData[0];
        return Assign;
    }
}