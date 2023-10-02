const db = require("../config/db.js");

module.exports = {
  showAssign: async (curUserLevel, curUserId) => {
    const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY AssignSchedule.due_date) AS AssignId,
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
         ROW_NUMBER() OVER (ORDER BY AssignSchedule.due_date) AS NewAssignId,
         title, assignschedule_id,
         UPPER(DATE_FORMAT(due_date, "%m.%d %a")) AS dueDate
        FROM
         AssignSchedule
        WHERE
         level = ?;
        `;
    const AllData = await db.query(query, [level]);
    const Data = AllData[0];
    console.log("Data: ", Data);
    return Data;
  },
  readAssignDetail: async (id, level) => {
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
    const AssignDetailData = db.query(query, [id, level]);
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
