const db = require("../config/db.js");

module.exports = {
  showAssign: async (curUserLevel, curUserId) => {
    const query = `
        SELECT
         ROW_NUMBER() OVER (ORDER BY AssignSchedule.due_date DESC) AS AssignId,
         AssignSchedule.title,
         Assign.grade,
         AssignSchedule.created_at AS created_at,
         AssignSchedule.due_date AS due_date,
         AssignSchedule.assignschedule_id
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
         title, assignschedule_id, due_date,
         created_at
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
         User.level = ? AND User.is_admin = 0;
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
  getCurrentAssignGrade: async (assignScheduleId, userId) => {
    const query =`
    SELECT
     grade
    FROM
     Assign
    WHERE
     assignschedule_id = ? AND user_id = ?;
    `
    const currentGrade = await db.query(query, [assignScheduleId, userId]);
    const currentGradeValue = currentGrade[0][0];

    return currentGradeValue.grade;
  },
  getAssigns: async (level) => {
    const query = `
    SELECT
      ROW_NUMBER() OVER (ORDER BY AssignSchedule.due_date) AS NewAssignId,
      title, assignschedule_id, due_date,
      created_at
    FROM
      AssignSchedule
    WHERE
      level = ?;`;
    
    const assigns = await db.query(query, [level]);
    return assigns[0];
  }
};
