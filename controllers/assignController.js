const assignModel = require('../models/assignModel.js');

module.exports = {
    showAssign: async (req, res) => {
        // 일반 회원의 과제 내역을 보여주는 페이지

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
    // 운영진
    // readAssignAll: async (req, res) => {
    //     // 운영진이 관리할 기수의 과제 일정 전체 read
        
    //     const data = await assignModel.readAssignAll(curUserLevel + 1);

    //     res.json({data: data});
    // },
    // readAssignDetail: async (req, res) => {
    //     // 특정 과제의 세부 사항 (기수 별 회원 목록, 그 회원의 과제 결과)

    //     const data = await assignModel.readAssignDetail(title, level);

    //     res.json({data: data});
    // },
    // createAssign: async (req, res) => {
    //     // 관리할 기수의 과제 일정 create

    //     const data = await assignModel.createAssign(level);

    //     res.json({data: data});
    // },
    // updateAssign: async (req, res) => {
    //     // 관리할 기수의 과제 일정 update

    //     const data = await assignModel.updateAssign()
    // },
    // deleteAssign: async (req, res) => {
    //     // 관리할 기수의 과제 일정 delete
    // },
    // createGrade: async (req, res) => {
    //     // 특정 과제 중 특정 회원의 과제 결과를 create
    // },
    // updateGrade: async (req, res) => {
    //     // 특정 과제 중 특정 회원의 과제 결과를 update
    // },
    
}