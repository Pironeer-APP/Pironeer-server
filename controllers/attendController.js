const attendModel = require('../models/attendModel.js');
const getNextScheduleIdx = require('../reusable/getNextScheduleIdx.js');
const depositModel = require('../models/depositModel.js');
const authModel = require('../models/authModel.js');

const recoverDeposit = async (user_id) => {
  // 방어권 사용 취소
  const user = await authModel.getAccount(user_id);
  const leftDeposit = user.deposit - 120000;
  const leftCnt = Math.trunc(leftDeposit / 10000); // 만원으로 나눈 몫만큼 보증금 방어권을 제거하면 됨
  if (leftCnt > 0) {
    await depositModel.updateExcessCoupon(user_id, leftCnt);
    // 12만원 넘어간 보증금 복귀
    await depositModel.updateDeposit(user_id, -leftDeposit);
  }
}

module.exports = {
  generateCode: async (req, res) => {
    const userInfo = req.body.account;
    // 관리자만 생성할 수 있도록
    if (userInfo.is_admin) {
      // tempAttend에 서로 다른 출석 코드의 데이터가 3개 이상일 경우 새로운 코드 생성 불가능
      const codesAlreadyExist = await attendModel.checkCode();
  
      if (codesAlreadyExist.result) {
        console.log('[출석 코드 생성 3회 초과로 제한]');
        return res.json({ code: 'excess' });
      }
      const code = await attendModel.generateCode();
      console.log('[출석 코드 생성 완료]', code);
      return res.json({ code: code });
    } else {
      console.log('[출석 코드 생성 관리자 권한 필요]', error);
      return res.json({ code: false });
    }
  },
  getSessionAttend: async (req, res) => {
    const userInfo = req.body.account;
    const session_id = req.body.session_id;
    const attends = await attendModel.getSessionAttend(session_id);
    res.json({len: attends.length});
  },
  // 회원들이 출석 코드를 입력하고 출석 버튼을 눌렀을 때
  addAttend: async (req, res) => {
    const userInfo = req.body.account;
    const user_id = userInfo.user_id;
    const input_code = req.body.input_code;

    console.log('서버가 받은 데이터!');
    console.log('사용자 정보:', userInfo);
    console.log('입력한 코드:', input_code);

    try {
      // TempAttend에 이미 정보가 있는지 확인
      const myTempAttend = await attendModel.findTempAttend(user_id, input_code);
      console.log(myTempAttend);
      if (myTempAttend.length > 0) {
        return res.json({result: 'exist'}); // 이미 정보가 존재함
      }
      const code = await attendModel.getCode();
      if(code) {
        // 생성된 코드가 있고, 코드와 입력된 코드가 같으면 출석
        if (code.code == input_code) {
          const result = await attendModel.addTempAttend(user_id, input_code);
          console.log('[출석 성공]', userInfo.name, '출석');
          return res.json({ result: result });
        }
      }
      console.log('[출석 실패]');
      return res.json({ result: false });
    } catch (error) {
      console.log('[출석 실패]', error);
      return res.json({ result: false });
    }
  },
  // 출결 삭제 버튼을 눌렀을 때
  deleteTempAttend: async (req, res) => {
    const { deleteCode } = req.body;
    const userInfo = req.body.account;
    console.log('받은 코드:', deleteCode);
    if (userInfo.is_admin) {
      const result = await attendModel.deleteTempAttend(deleteCode);

      return res.json({ result: result });
    }
  },
  // 오늘 출결 종료 버튼을 눌렀을 때
  endAttend: async (req, res) => {
    const { session_id } = req.body;
    const userInfo = req.body.account;
    console.log('사용자 정보', userInfo);
    if (userInfo.is_admin) {
      const thisLevel = userInfo.level;
      const result = await attendModel.endAttend(session_id, thisLevel);
      // 보증금 반영
      const attends = await attendModel.getSessionAttend(session_id);
      for (let attend of attends) {
        if (attend.type === '결석') {
          await depositModel.updateDeposit(attend.user_id, -20000);
        } else if (attend.type === '지각') {
          await depositModel.updateDeposit(attend.user_id, -10000);
        }
      }
      return res.json({ result: result }); //true or false 반환 됨
    }
  },
  // 오늘 출결 삭제 버튼 눌렀을 때
  cancelAttend: async (req, res) => {
    const { session_id } = req.body;
    const userInfo = req.body.account;
    console.log('사용자 정보', userInfo);
    if (userInfo.is_admin) {
      /*
       존재하던 출결 사항을 가지고 보증금을 되돌려 놓아야 함
       결석 -> +2만 지각 -> +1만 출석 -> 아무 것도 안 해도 됨
      */
      // 보증금 반영
      const attends = await attendModel.getSessionAttend(session_id);
      console.log(attends);
      for (let attend of attends) {
        if (attend.type === '결석') {
          await depositModel.updateDeposit(attend.user_id, 20000);
        } else if (attend.type === '지각') {
          await depositModel.updateDeposit(attend.user_id, 10000);
        }
        // 방어권 사용 취소
        await recoverDeposit(attend.user_id);
      }
      

      // 오늘 출결 삭제
      const result = await attendModel.cancelAttend(session_id);
      if (result.affectedRows > 0) {
        return res.json({ result: true });
      } else {
        return res.json({ result: '출결 삭제 실패: 출결 데이터 없음' });
      }
    }
  },
  // 출결 수정
  updateAttend: async (req, res) => {
    const { user_id, attendType, session_id } = req.body;
    console.log(user_id, attendType, session_id);
    // 1. 수정 대상 출결 가져옴
    const targetAttend = await attendModel.getUserSessionAttend(user_id, session_id);
    // 1-1. 수정 대상 출결이 없을 때 출결을 새로 생성
    if (targetAttend === undefined) {
      await attendModel.createAttend(user_id, session_id, attendType);
      // 지각/결석인 경우 보증금 차감
      if (attendType === '지각') {
        await depositModel.updateDeposit(user_id, -10000);
      } else if (attendType === '결석') {
        await depositModel.updateDeposit(user_id, -20000);
      }
      console.log('[출결 신규 생성됨]');
      return res.json({ result: true });
    }
    // 2. type 비교, 같으면 update 하지 않음
    if (targetAttend.type === attendType) {
      console.log('[출결 변동 사항 없음]');
      return res.json({ result: true });
    }
    // 3. 다른 경우
    // 3-1. 지각 -> 출석: +1만
    if (targetAttend.type === '지각' && attendType === '출석') {
      await depositModel.updateDeposit(user_id, 10000);
    } else if (targetAttend.type === '결석') {
      // 3-3. 결석 -> 출석: +2만
      // 3-4. 결석 -> 지각: +1만
      if (attendType === '출석') {
        await depositModel.updateDeposit(user_id, 20000);
      } else if (attendType === '지각') {
        await depositModel.updateDeposit(user_id, 10000);
      }
    } else if (targetAttend.type === '출석') {
      // 3-5. 출석이었을 때와 지각 -> 결석은 더하여 차감되는 경우, 보증금이 음수가 되는지만 확인 (또는 마이너스통장)
      if (attendType === '지각') {
        await depositModel.updateDeposit(user_id, -10000);
      } else if (attendType === '결석') {
        await depositModel.updateDeposit(user_id, -20000);
      }
    } else if (targetAttend.type === '지각' && attendType === '결석') {
      await depositModel.updateDeposit(user_id, -10000);
    }

    // 방어권 사용 취소
    await recoverDeposit(user_id);

    // 출결 수정 사항 반영
    const result = await attendModel.updateAttend(user_id, attendType, session_id);

    res.json({ result: result });
  },
  // 특정 회원 출석 제거
  removeAttend: async (req, res) => {
    /*
      1. user_id와 session_id로 출결 정보 조회
      1-1. 없으면 리턴
      2. 있으면 type 기억
      3. type이 지각/결석이면 보증금 회복
      3-1. 보증금이 13만원 이상이 되면 계산하기
      4. 출결 데이터 제거
    */

    const { user_id, session_id } = req.body;
    // 1번
    const attend = await attendModel.getUserSessionAttend(user_id, session_id);
    if (attend === undefined) return res.json({ result: true });
    // 2, 3번
    if (attend.type === '지각') {
      await depositModel.updateDeposit(user_id, 10000);
    } else if (attend.type === '결석') {
      await depositModel.updateDeposit(user_id, 20000);
    }
    
    // 방어권 사용 취소
    await recoverDeposit(user_id);

    // 4번
    await attendModel.removeAttend(user_id, session_id);

    console.log('[출결 제거 완료]');
    return res.json({ result: true });
  },
  getSessionAttendAdmin: async (req, res) => {
    const session_id = req.body.session_id;
    const userInfo = req.body.account;
    if (userInfo.is_admin) {
      const attends = await attendModel.getSessionAttendAdmin(userInfo.level, session_id);
      return res.json({ attends: attends });
    } else {
      console.log('[출석 정보 불러오기 실패]_관리자 권한 필요');
      return res.json({ attends: false });
    }
  },
  getSessionAndAttend: async (req, res) => {
    const userInfo = req.body.account;
    const sessions = await attendModel.getSessionAndAttend(userInfo.user_id, userInfo.level);

    const nextSessionIdx = getNextScheduleIdx.getNextScheduleIdx(sessions);

    console.log('[세션 정보와 출결 가져오기 성공]');

    res.json({ sessions: sessions, nextSessionIdx: nextSessionIdx });
  },
  // 오늘 출석 코드, 코드 생성 시간 가져오기
  getCode: async (req, res) => {
    const userInfo = req.body.account;
    if (userInfo.is_admin) {
      const code = await attendModel.getCode();
      console.log('[생성된 코드]', code);
      return res.json({ code: code });
    }
    console.log('[출석 코드 조회 실패]_관리자 권한 필요');
    return res.json({ code: false });
  }
}