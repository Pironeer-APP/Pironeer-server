const assignModel = require("../models/assignModel.js");

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

    res.json({ data: data });
  },
  // 운영진
  readAssignAll: async (req, res) => {
    // 운영진이 관리할 기수의 과제 일정 전체 read

    // 운영진이 관리할 기수 level (운영진의 level + 1)
    const level = req.params.level;
    const data = await assignModel.readAssignAll(level);
    res.json({ data: data });
  },
  readAssignDetail: async (req, res) => {
    // 특정 과제의 세부 사항 (기수 별 회원 목록, 그 회원의 과제 결과)

    // client: 관리할 level, 클릭한 과제의 title
    const level = req.params.level;
    const title = req.body.title;
    const data = await assignModel.readAssignDetail(title, level);
    res.json({ data: data });
  },
  createAssign: async (req, res) => {
    // 관리할 기수의 과제 일정 create

    // client: 관리할 level, inputTitle , inputDueDate
    const level = req.params.level;
    const inputTitle = req.body.title;
    const inputDueDate = req.body.dateData;
    await assignModel.createAssign(level, inputTitle, inputDueDate);

    res.json();
  },
  //   updateAssign: async (req, res) => {
  //     // 관리할 기수의 과제 일정 update 시 기존의 정보 get

  //     // client: 관리할 level, update할 과제 일정의 assignschedule_id
  //     const level = req.body.level;
  //     const updateId = req.body.assignLevel;
  //     console.log(level, updateId);
  //     await assignModel.updateAssign(level, updateId);
  //     //
  //   },
  updatedAssign: async (req, res) => {
    // 관리할 기수의 과제 일정 update

    // client: 관리할 level, update할 과제 일정의 assignschedule_id, newTitle, newDueDate
    const level = req.params.level;
    const updateId = req.body.assignId;
    const newTitle = req.body.title;
    const newDueDate = req.body.date;
    console.log("온 데이터: ", level, updateId, newTitle, newDueDate);
    await assignModel.updatedAssign(level, updateId, newTitle, newDueDate);

    res.json();
  },
  deleteAssign: async (req, res) => {
    // 관리할 기수의 과제 일정 delete

    // client: 관리할 level, delete할 과제 일정의 assignschedule_id
    const level = req.body.level;
    const deleteId = req.body.deleteId;
    await assignModel.deleteAssign(level, deleteId);

    res.json();
  },
  readGrade: async (req, res) => {
    // 특정 과제 일정 중 특정 회원의 과제 결과를 read

    // client: 현재 들어온 페이지의 과제 일정 assignschedule_id, 선택한 회원의 user_id, 회원의 과제 결과 Grade(없으면 null)
    const assignScheduleId = req.body.assignScheduleId;
    const userId = req.body.userId;
    const grade = req.body.grade;
    const data = await assignModel.readGrade(assignScheduleId, userId, grade);

    res.json({ data: data });
  },
  createGrade: async (req, res) => {
    // 특정 과제 일정 중 특정 회원의 과제 결과를 create/update

    // client: 현재 들어온 페이지의 과제 일정 assignschedule_id, 선택한 회원의 user_id, 회원의 과제 결과 inputGrade
    const assignScheduleId = req.body.assignScheduleId;
    const userId = req.body.userId;
    const inputGrade = req.body.inputGrade;
    await assignModel.createGrade(assignScheduleId, userId, inputGrade);

    res.json();
  },
};
