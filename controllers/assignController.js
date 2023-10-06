const assignModel = require("../models/assignModel.js");
const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel.js");
const depositModel = require("../models/depositModel.js");

module.exports = {
// userInfo data를 위해 client에서 userToken 전송
  showAssign: async (req, res) => {
    // 일반 회원의 과제 내역을 보여주는 페이지
    const { userToken } = req.body;

    const userInfo = jwt.verify(userToken, process.env.JWT);
    const data = await assignModel.showAssign(userInfo.level, userInfo.user_id);

    res.json({ data: data });

    // AssignId: created_at에 따라 새로 부여한 id값
    // title: 과제 제목
    // due_date: 과제 마감 기한
    // created_at: 과제 생성 시각
    // grade: 과제 결과 (0: 미제출, 1: 미흡, 2: 지각, 3: 완료)
    // done: 과제 진행 여부 (0: 진행중, 1: 완료)
  },
  // 운영진
  readAssignAll: async (req, res) => {
    // 운영진이 관리할 기수의 과제 일정 전체 read
    // 운영진이 관리할 기수 level == 운영진의 level
    const { userToken } = req.body;
    
    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            const data = await assignModel.readAssignAll(userInfo.level);
            res.json({ data: data });
        }
    } catch (error) {
        console.log('readAssignAll error', error);
        res.json({ data: false });
    }
  },
  readAssignDetail: async (req, res) => {
    // 특정 과제의 세부 사항 (기수 별 회원 목록, 그 회원의 과제 결과)
    // client: 클릭한 과제의 assignschedule_id
    const { userToken, assignId } = req.body;
    console.log(userToken, assignId);

    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            const data = await assignModel.readAssignDetail(assignId, userInfo.level);
            // console.log(data);
            res.json({ data: data });
        }
    } catch (error) {
        console.log('readAssignDetail error', error);
        res.json({ data: false });
    }
  },
  createAssign: async (req, res) => {
    // 관리할 기수의 과제 일정 create
    // client: inputTitle , inputDueDate
    const { userToken, title, dateData } = req.body;
    console.log(title, dateData);
    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            const data = await assignModel.createAssign(userInfo.level, title, dateData);
            res.json({ data: data }); // data 꼭 넘겨줘야 하나?
        }
    } catch (error) {
        console.log('createAssign error', error);
        res.json({ data: false });
    }
  },
  updateAssign: async (req, res) => {
    // 관리할 기수의 과제 일정 update
    // client: update할 과제 일정의 assignschedule_id, newTitle, newDueDate
    const { userToken, assignId, title, formattedDate } = req.body;

    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            await assignModel.updateAssign(userInfo.level, assignId, title, formattedDate);
            res.json();
        }
    } catch (error) {
        console.log('updateAssign error', error);
        res.json({ data: false });
    }
  },
  deleteAssign: async (req, res) => {
    // 관리할 기수의 과제 일정 delete
    // client: delete할 과제 일정의 assignschedule_id
    const { userToken, deleteId } = req.body;

    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            const data = await assignModel.deleteAssign(userInfo.level, deleteId);
            res.json({ data: data });
        }
    } catch (error) {
        console.log('deleteAssign error', error);
        res.json({ data: false });
    }
  },
  createGrade: async (req, res) => {
    // 특정 과제 일정 중 특정 회원의 과제 결과를 create
    // client: 현재 들어온 페이지의 과제 일정 assignschedule_id, 선택한 회원의 user_id, 회원의 과제 결과 inputGrade
    const { userToken, assignScheduleId, userId, inputGrade } = req.body;

    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            const data = await assignModel.createGrade(assignScheduleId, userId, inputGrade);
            
            // 보증금 금액을 변경하는 updateDeposit
            switch (inputGrade) {
                case 0:
                    await userModel.updateDeposit(userId, -20000);
                    break;
                case 1:
                case 2:
                    await userModel.updateDeposit(userId, -10000);
                    break;
            }

            res.json({ data: data });
        }
    } catch (error) {
        console.log('createGrade error', error);
        res.json({ data: false });
    }
  },
  updateGrade: async (req, res) => {
    // 특정 과제 일정 중 특정 회원의 과제 결과를 update
    // client: 현재 들어온 페이지의 과제 일정 assignschedule_id, 선택한 회원의 user_id, 회원의 과제 결과 inputGrade
    const { userToken, assignScheduleId, userId, updateGrade } = req.body;

    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        if (userInfo.is_admin) {
            // 현재 user의 grade 불러오기
            const curGrade = await assignModel.getCurrentAssignGrade(assignScheduleId, userId);

            // 1. curGrade에 따라
            // switch (curGrade) {
            //     case 0:
            //         if (updateGrade === 1 || updateGrade === 2)
            //             await userModel.updateDeposit(userId, 10000);
            //         else if (updateGrade === 3)
            //             await userModel.updateDeposit(userId, 20000);
            //         break;
            //     case 1:
            //     case 2:
            //         if (updateGrade === 0)
            //             await userModel.updateDeposit(userId, -10000);
            //         else if (updateGrade === 3)
            //             await userModel.updateDeposit(userId, 10000);
            //         break;
            //     case 3:
            //         if (updateGrade === 0)
            //             await userModel.updateDeposit(userId, -20000);
            //         else if (updateGrade === 1 || updateGrade === 2)
            //             await userModel.updateDeposit(userId, -10000);
            //         break;
            // }

            // console.log('curGrade:', curGrade, 'updateGrade:', updateGrade);

            // 채점 전 상태 추가! 따로 분리
            if (curGrade === 4 && updateGrade === 0)
                await userModel.updateDeposit(userId, -20000);
            else if (curGrade === 4 && (updateGrade === 1 || updateGrade === 2))
                await userModel.updateDeposit(userId, -10000);
            else if (curGrade === 0 && updateGrade === 4)
                await userModel.updateDeposit(userId, 20000);
            else if ((curGrade === 1 || curGrade === 2) && updateGrade === 4)
                await userModel.updateDeposit(userId, 10000);

            // 2. 수행할 작업의 종류에 따라
            if (curGrade === 3 && updateGrade === 0)
                await userModel.updateDeposit(userId, -20000);
            else if (((curGrade === 1 || curGrade === 2) && updateGrade === 0) || (curGrade === 3 && (updateGrade === 1 || updateGrade === 2)))
                await userModel.updateDeposit(userId, -10000);
            else if (((curGrade === 1 || curGrade === 2) && updateGrade === 3) || (curGrade === 0 && (updateGrade === 1 || updateGrade === 2))) {
                await userModel.updateDeposit(userId, 10000);

                // 이미 쿠폰을 사용하여 보증금이 13만원이거나 14만원일 경우
                const user = await userModel.getOneUserInfo(userId);
                const newDeposit = user.deposit;
                console.log(newDeposit);
                if (newDeposit === 130000) {
                    // 가장 최근 사용된 쿠폰 n개를 사용 취소 (SET is_used=0, deposit -10000*n)
                    await depositModel.updateExcessCoupon(userId, 1);
                    await userModel.updateDeposit(userId, -10000);
                } else if (newDeposit === 140000) {
                    await depositModel.updateExcessCoupon(userId, 2);
                    await userModel.updateDeposit(userId, -20000);
                }
            }
            else if (curGrade === 0 && updateGrade === 3) {
                await userModel.updateDeposit(userId, 20000);

                const user = await userModel.getOneUserInfo(userId);
                const newDeposit = user.deposit;
                console.log(newDeposit);
                if (newDeposit === 130000) {
                    await depositModel.updateExcessCoupon(userId, 1);
                    await userModel.updateDeposit(userId, -10000);
                } else if (newDeposit === 140000) {
                    await depositModel.updateExcessCoupon(userId, 2);
                    await userModel.updateDeposit(userId, -20000);
                }
            }
                
            // grade update
            const data = await assignModel.updateGrade(assignScheduleId, userId, updateGrade);

            res.json({ data: data });
        }
    } catch (error) {
        console.log('updateGrade error', error);
        res.json({ data: false });
    }
  },
  getCurrentAssigns: async (req, res) => {
    const {userToken} = req.body;
    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        const currentAssigns = await assignModel.getCurrentAssigns(userInfo.level);
        res.json({currentAssign: currentAssigns[0], currentAssignCnt: currentAssigns.length});
    } catch(error) {
        console.log('[getCurrentAssigns error]', error);
        res.json({currentAssign: false, currentAssignCnt: false});
    }
  },
  getRecentAssign: async (req, res) => {
    const {userToken} = req.body;
    try {
        const userInfo = jwt.verify(userToken, process.env.JWT);
        const recentAssign = await assignModel.getRecentAssign(userInfo.level);
        res.json({recentAssign: recentAssign});
    } catch(error) {
        console.log('[getRecentAssign error]', error);
        res.json({recentAssign: false});
    }
  }
};
