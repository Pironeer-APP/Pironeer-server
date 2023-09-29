const assignModel = require('../models/assignModel.js');

module.exports = {
    showAssign: async (req, res) => {
        const curUserLevel = req.body.userLevel; // level get
        const curUserId = req.body.userId; // id get

        const data = await assignModel.showAssign(curUserLevel, curUserId);

        // AssignId: created_at에 따라 새로 부여한 id값
        // title: 과제 제목
        // due_date: 과제 마감 기한
        // created_at: 과제 생성 시각
        // grade: 과제 결과 (0: 미제출, 1: 미흡, 2: 지각, 3: 완료)
        // done: 과제 진행 여부 (0: 진행중, 1: 완료)

        res.json({data: data});
    },
}