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
        LEFT JOIN
         Assign
        ON
         AssignSchedule.assignschedule_id = Assign.assignschedule_id
        WHERE
         AssignSchedule.level = ? AND Assign.user_id = ?;
        `;
        const AssignData = await db.query(query, [curUserLevel, curUserId]); // 회원의 기수, 회원 식별자로 필터링
        const Assign = AssignData[0];

        return Assign;
    },
    // readAssignAll: async (level) => {
    //     const query = `
    //     SELECT
    //      AssignSchedule.title, AssignSchedule.created_at, AssignSchedule.assignschedule_id
    //     FROM
    //      AssignSchedule
    //     WHERE
    //      AssignSchedule.level = ?;
    //     `
    //     const AllData = await db.query(query, [level]);
    //     const Data = AllData[0];

    //     return Data;
    // },
    // readAssignDetail: async (title, level) => {
    //     const query = `
    //     SELECT
    //      ROW_NUMBER() OVER (ORDER BY Assign.user_id) AS AssignUserId,
    //      AssignSchedule.title,
    //      Assign.user_id, Assign.grade, Assign.reason
    //     FROM
    //      Assign
    //     JOIN
    //      AssignSchedule
    //     ON
    //      AssignSchedule.assignschedule_id = Assign.assignschedule_id
    //     WHERE
    //      AssignSchedule.title = ? AND AssignSchedule.level = ?;
    //     `
    //     const AssignDetailData = db.query(query, [title, level]);
    //     const Data = AssignDetailData[0];

    //     return Data;
    // },
    // createAssign: async (level) => {
    //     const query = `
    //     INSERT INTO
    //      Assign
    //     `
    // },
    // updateAssign: async ()
}