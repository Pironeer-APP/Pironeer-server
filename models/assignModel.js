const db = require("../config/db.js");

module.exports = {
  showAssign: async (curUserLevel, curUserId) => {
    const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY AssignSchedule.due_date DESC) AS AssignId,
         AssignSchedule.title,
         DATE_FORMAT(AssignSchedule.due_date, "%m.%d") AS dueDate,
         UPPER(DATE_FORMAT(AssignSchedule.created_at, "%m.%d %a")) AS createdDate,
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
         AssignSchedule.assignschedule_id = Assign.assignschedule_id AND Assign.user_id = ?
        WHERE
         AssignSchedule.level = ?;
        `;
    const AssignData = await db.query(query, [curUserId, curUserLevel]);
    const Assign = AssignData[0];

    return Assign;
  },
  readAssignAll: async (level) => {
    const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY AssignSchedule.due_date DESC) AS NewAssignId,
         title, assignschedule_id, due_date
        FROM
         AssignSchedule
        WHERE
         level = ?;
        `;
    const AllData = await db.query(query, [level]);
    const Data = AllData[0];

    return Data;
  },
  readAssignDetail: async (id, level) => {
    const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY User.name) AS studentId,
         User.name, User.user_id, Assign.grade
        FROM
         User
        LEFT JOIN
         Assign
        ON
         (Assign.user_id = User.user_id AND Assign.assignschedule_id = ?) AND TRUE
        WHERE
         User.level = ?;
        `;
    const AssignDetailData = await db.query(query, [id, level]);
    const resAssignDetailData = AssignDetailData[0];

    return resAssignDetailData;
  },
  createAssign: async (level, inputTitle, inputDueDate) => {
    const query = `
        INSERT INTO
         AssignSchedule (level, title, due_date) VALUES (?, ?, ?);
        `;
    db.query(query, [level, inputTitle, inputDueDate]);
  },
  updateAssign: async (level, updateId, newTitle, newDueDate) => {
    const query = `
        UPDATE
         AssignSchedule
        SET
         level = ? , title = ? , due_date = ?
        WHERE
         assignschedule_id = ?;
        `;
        await db.query(query, [level, newTitle, newDueDate, updateId]);
  },
  deleteAssign: async (level, deleteId) => {
    const query = `
        DELETE FROM
         AssignSchedule
        WHERE
         level = ? AND assignschedule_id = ?;
        `;
        await db.query(query, [level, deleteId]);
  },
  createGrade: async (assignScheduleId, UserId, inputGrade) => {
    const query = `
        INSERT INTO
         Assign (user_id, grade, assignschedule_id)
        VALUES (? , ? , ?);
        `;
        await db.query(query, [UserId, inputGrade, assignScheduleId]);
  },
  updateGrade: async (assignScheduleId, UserId, updateGrade) => {
    const query = `
        UPDATE
         Assign
        SET
         grade = ?
        WHERE
         assignschedule_id = ? AND user_id = ?;
        `;
        await db.query(query, [updateGrade, assignScheduleId, UserId]);
  },
};
