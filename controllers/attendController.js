const attendModel = require('../models/attendModel.js');
const jwt = require('jsonwebtoken');
const getNextScheduleIdx = require('../reusable/getNextScheduleIdx.js');
const sessionModel = require('../models/sessionModel.js');
const userModel = require('../models/userModel.js');
const depositModel = require('../models/depositModel.js');

module.exports = {
  generateCode: async (req, res) => {
    const userToken = req.body.token;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      // 관리자만 생성할 수 있도록
      if (userInfo.is_admin) {
        const code = await attendModel.generateCode();
        console.log('[출석 코드 생성 완료]', code);
        res.json({ code: code });
      } else {
        console.log('[출석 코드 생성 관리자 권한 필요]', error);
        res.json({ code: false });
      }
    } catch (error) {
      console.log('[출석 코드 생성 오류]', error);
      res.json({ code: false });
    }
  },
  // 회원들이 출석 코드를 입력하고 출석 버튼을 눌렀을 때
  addAttend: async (req, res) => {
    const userToken = req.body.token;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const user_id = userInfo.user_id;
      const input_code = req.body.input_code;

      try {
        const code = await attendModel.getCode();
        // 생성된 코드가 있고, 코드와 입력된 코드가 같으면 출석
        if (code && code === input_code) {
          const result = await attendModel.addTempAttend(user_id, '출석');
          console.log('[출석 성공]', userInfo.name, '출석');
          return res.json({ result: result });
        }
        console.log('[출석 실패]');
        return res.json({ result: false });
      } catch (error) {
        console.log('[출석 실패]', error);
        return res.json({ result: false });
      }
    } catch (error) {
      console.log('[출석 실패]', error);
      return res.json({ result: false });
    }
  },
  // 출결 저장 버튼을 눌렀을 때
  confirmAttend: async (req, res) => {
    const userToken = req.body.token;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const is_admin = userInfo.is_admin;
      
      const todaySession = sessionModel.getTodaySession();

      if (is_admin) {
        try {
          const attends = await attendModel.getSessionAttend(todaySession.session_id);
          let result;
          let part;
          // 첫 번째 출결: 오늘 날짜의 Attend 테이블 데이터가 없음
          if (attends) {
            result = await attendModel.addFirstAttend(todaySession.session_id);
            part = 1;
            // 보증금에 결과 반영
            // attend 데이터 다시 조회, 결석이면 -2만
            const newAttends = await attendModel.getSessionAttend(todaySession.session_id);
            newAttends.forEach(async (attend) => {
              if(attend.type === '결석')
                await depositModel.updateDeposit(attend.user_id, -20000);
            });
          } else {
            // 두 번째 출결: 오늘 날짜의 Attend 테이블 데이터가 있음
            // 보증금에 결과 반영 먼저
            // 65번째 줄에서 조회한 attends 중 결석이면 +2만으로 회복
            attends.forEach(async (attend) => {
              if(attend.type === '결석')
                await depositModel.updateDeposit(attend.user_id, 20000);
            });
            result = await attendModel.addNextAttend(todaySession.session_id, 2);
            part = 2;
            // 보증금에 결과 재반영
            // attend 데이터 다시 조회, 결석이면 -2만 지각이면 -1만
            const newAttends = await attendModel.getSessionAttend(todaySession.session_id);
            newAttends.forEach(async (attend) => {
              if(attend.type === '결석')
                await depositModel.updateDeposit(attend.user_id, -20000);
              else if(attend.type === '지각')
                await depositModel.updateDeposit(attend.user_id, -10000);
            });
          }
          console.log('[출석 저장 성공]');
          return res.json({ result: result, part: part });
        } catch (error) {
          console.log('[출석 저장 실패]', error);
        }
      }
      console.log('[출석 저장 실패_관리자 아님]');
      return res.json({ result: false, part: false });
    } catch (error) {
      console.log('[출석 저장 실패]', error);
      return res.json({ result: false, part: false });
    }
  },
  // 출결 종료 버튼을 눌렀을 때
  endAttend: async (req, res) => {
    const userToken = req.body.token;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const is_admin = userInfo.is_admin;

      const todaySession = sessionModel.getTodaySession();
      
      if (is_admin) {

        const attends = await attendModel.getSessionAttend(todaySession.session_id);

        if (attends) {
          try {
            // 세 번째 출결
            // 보증금에 결과 반영 먼저
            // 123번째 줄에서 조회한 attends 중 결석이면 +2만으로 회복, 지각이면 +1만으로 회복
            attends.forEach(async (attend) => {
              if(attend.type === '결석')
                await depositModel.updateDeposit(attend.user_id, 20000);
              else if(attend.type === '지각')
                await depositModel.updateDeposit(attend.user_id, 10000);
            });
            const result = await attendModel.addNextAttend(todaySession.session_id, 3);
            const part = 3;
            // 보증금에 결과 재반영
            // attend 데이터 다시 조회, 결석이면 -2만 지각이면 -1만
            const newAttends = await attendModel.getSessionAttend(todaySession.session_id);
            newAttends.forEach(async (attend) => {
              if(attend.type === '결석')
                await depositModel.updateDeposit(attend.user_id, -20000);
              else if(attend.type === '지각')
                await depositModel.updateDeposit(attend.user_id, -10000);
            });
            console.log('[출석 종료 성공]');
            return res.json({ result: result, part: part });
          } catch (error) {
            console.log('[출석 종료 실패]', error);
            console.log(error);
          }
        } else {
          console.log('[출석 종료 실패_진짜 출석 테이블 데이터 없음]');
          return res.json({ result: false, part: false });
        }
      }
      console.log('[출석 종료 실패_관리자 아님]');
      return res.json({ result: false, part: false });
    } catch (error) {
      console.log('[출석 종료 실패]', error);
      return res.json({ result: false, part: false });
    }
  },
  // 출결 수정
  updateAttend: async (req, res) => {
    const {user_id, attendType, session_id} = req.body;
    console.log(user_id, attendType, session_id);
    // 1. 수정 대상 출결 가져옴
    const targetAttend = await attendModel.getUserSessionAttend(user_id, session_id);
    console.log(targetAttend);
    // 2. type 비교, 같으면 update 하지 않음
    if(targetAttend.type === attendType) {
      console.log('[출결 변동 사항 없음]');
      return res.json({result: true});
    }
    // 3. 다른 경우
    // 3-1. 지각 -> 출석: +1만
    if(targetAttend.type === '지각' && attendType === '출석') {
      await userModel.updateDeposit(user_id, 10000);
    } else if(targetAttend === '결석') {
      // 3-3. 결석 -> 출석: +2만
      // 3-4. 결석 -> 지각: +1만
      if(attendType === '출석') {
        await userModel.updateDeposit(user_id, 20000);
      } else if(attendType === '지각') {
        await userModel.updateDeposit(user_id, 10000);
      }
    } else if(targetAttend.type === '출석') {
      // 3-5. 출석이었을 때와 지각 -> 결석은 더하여 차감되는 경우, 보증금이 음수가 되는지만 확인 (또는 마이너스통장)
      if(attendType === '지각') {
        await userModel.updateDeposit(user_id, -10000);
      } else if(attendType === '결석') {
        await userModel.updateDeposit(user_id, -20000);
      }
    } else if(targetAttend.type === '지각' && attendType === '결석') {
      await userModel.updateDeposit(user_id, -10000);
    }

    // 방어권 사용 취소
    const user = await userModel.getOneUserInfo(user_id);
    const leftDeposit = user.deposit - 120000;
    const leftCnt = Math.trunc(leftDeposit / 10000); // 만원으로 나눈 몫만큼 보증금 방어권을 제거하면 됨
    if(leftCnt > 0) {
      await depositModel.updateExcessCoupon(user_id, leftCnt);
      // 12만원 넘어간 보증금 복귀
      await depositModel.updateDeposit(user_id, -leftDeposit);
    }
    
    // 출결 수정 사항 반영
    const result = await attendModel.updateAttend(user_id, attendType, session_id);

    res.json({result: result});
  },
  getSessionAttendAdmin: async (req, res) => {
    const userToken = req.body.userToken;
    const session_id = req.body.session_id;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      if(userInfo.is_admin) {
        const attends = await attendModel.getSessionAttendAdmin(userInfo.level, session_id);
        return res.json({attends: attends});
      } else {
        console.log('[출석 정보 불러오기 실패]_관리자 권한 필요');
        return res.json({attends: false});
      }
    } catch(error) {
      console.log('[출석 정보 불러오기 실패]', error);
      return res.json({attends: false});
    }
  },
  getSessionAndAttend: async (req, res) => {
    const userToken = req.body.userToken;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const sessions = await attendModel.getSessionAndAttend(userInfo.user_id, userInfo.level);
      
      const nextSessionIdx = getNextScheduleIdx.getNextScheduleIdx(sessions);

      res.json({sessions: sessions, nextSessionIdx: nextSessionIdx});
    } catch(error) {
      console.log(error);
      res.json({sessions: false});
    }
  },
  // 오늘 출석 코드, 코드 생성 시간 가져오기
  getCode: async (req, res) => {
    const userToken = req.body.userToken;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      if(userInfo.is_admin) {
        const code = await attendModel.getCode();
        return res.json({code: code});
      }
      console.log('[출석 코드 조회 실패]_관리자 권한 필요');
      return res.json({code: false});
    } catch(error) {
      console.log('[출석 코드 조회 실패]', error);
      return res.json({code: false});
    }
  }
}