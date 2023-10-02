const db = require("../config/db.js");

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
  readAssignAll: async (level) => {
    const query = `
        SELECT
         title, created_at, assignschedule_id, due_date
        FROM
         AssignSchedule
        WHERE
         level = ?
        ORDER BY 
         due_date 
        DESC;
        `;
    const AllData = await db.query(query, [level]);
    const Data = AllData[0];
    console.log("Data: ", Data);
    return Data;
  },
  readAssignDetail: async (id, level) => {
        // SELECT
        //  ROW_NUMBER() OVER (ORDER BY Assign.user_id) AS AssignUserId,
        //  AssignSchedule.title,
        //  Assign.user_id, Assign.grade, Assign.reason
        // FROM
        //  Assign
        // JOIN
        //  AssignSchedule
        // ON
        //  AssignSchedule.assignschedule_id = Assign.assignschedule_id
        // WHERE
        //  AssignSchedule.title = ? AND AssignSchedule.level = ?;
    const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY User.name) AS studentId,
         User.name, Assign.grade
        FROM
         User
        LEFT JOIN
         Assign
        ON
         Assign.user_id = User.user_id AND Assign.assignschedule_id = ?
        WHERE
         User.level = ?;
        `;
    const AssignDetailData = db.query(query, [title, level]);
    const Data = AssignDetailData[0];

    return Data;
  },
  createAssign: async (level, inputTitle, inputDueDate) => {
    const query = `
        INSERT INTO
         AssignSchedule (level, title, due_date) VALUES (?, ?, ?);
        `;
    db.query(query, [level, inputTitle, inputDueDate]);
  },
  updateAssign: async (level, updateId) => {
    const query = `
        SELECT
         title, due_date
        FROM
         AssignSchedule
        WHERE
         level = ? AND assignschedule_id = ?;
        `;
    const Data = db.query(query, [level, updateId]);

    return Data[0];
  },
  updatedAssign: async (level, updateId, newTitle, newDueDate) => {
    const query = `
        UPDATE
         AssignSchedule
        SET
         level = ? , title = ? , due_date = ?
        WHERE
         assignschedule_id = ?;
        `;
    db.query(query, [level, updateId, newTitle, newDueDate]);
  },
  deleteAssign: async (level, deleteId) => {
    const query = `
        DELETE FROM
         AssignSchedule
        WHERE
         level = ? AND assignschedule_id = ?;
        `;
    db.query(query, [level, deleteId]);
  },
  readGrade: async (assignScheduleId, UserId) => {
    const query = `
        SELECT
         grade
        FROM
         Assign
        WHERE
         assignschedule_id = ? AND user_id = ?;
        `;
    const data = db.query(query, [assignScheduleId, UserId]);

    return data[0];
  },
  createGrade: async (assignScheduleId, UserId, inputGrade, inputReason) => {
    const query = `
        INSERT INTO
         Assign (user_id, grade, reason, assignschedule_id)
        VALUES (? , ? , ?, ?);
        `;
    db.query(query, [UserId, inputGrade, inputReason, assignScheduleId]);
  },
};
