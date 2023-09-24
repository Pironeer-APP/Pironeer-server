const db = require('../config/db.js');

module.exports = {
    showGrade: async (curUserId) => {
        const query = `
        SELECT
          grade
        FROM Grade
        WHERE user_id=?;`;
        const userGradeData = await db.query(query, curUserId);
        const userGrade = userGradeData[0];
        console.log(userGrade);
    },
    showAssign: async (curUserLevel) => {
        const query = `
        SELECT
          title, due_date, created_at
        FROM Post
        WHERE level=? AND category=?;`;
        const thisLevelAssignData = await db.query(query, curUserLevel, 2); // 회원의 기수, 과제 카테고리 필터링
        const thisLevelAssign = thisLevelAssignData[0];
        console.log(thisLevelAssign);
    }
}