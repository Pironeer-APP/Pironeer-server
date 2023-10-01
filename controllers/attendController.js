const attendModel = require('../models/attendModel.js');
const jwt = require('jsonwebtoken');

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
      const session_id = req.body.session_id;

      if (is_admin) {
        try {
          const attends = await attendModel.getSessionAttend(session_id);
          let result;
          // 첫 번째 출결: 오늘 날짜의 Attend 테이블 데이터가 없음
          if (attends) {
            result = await attendModel.addFirstAttend(session_id, absentUserIdList, tempAttendList);
          } else {
            // 두 번째 출결: 오늘 날짜의 Attend 테이블 데이터가 있음
            result = await attendModel.addNextAttend(session_id, 2);
          }
          console.log('[출석 저장 성공]');
          res.json({ result: result });
        } catch (error) {
          console.log('[출석 저장 실패]', error);
          console.log(error);
        }
      }
      console.log('[출석 저장 실패_관리자 아님]');
      res.json({ result: false });
    } catch (error) {
      console.log('[출석 저장 실패]', error);
      return res.json({ result: false });
    }
  },
  // 출결 종료 버튼을 눌렀을 때
  endAttend: async (req, res) => {
    const userToken = req.body.token;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const is_admin = userInfo.is_admin;
      const session_id = req.body.session_id;
      if (is_admin) {

        const attends = await attendModel.getSessionAttend(session_id);

        if (attends) {
          try {
            // 세 번째 출결
            const result = await attendModel.addNextAttend(session_id, 3);
            console.log('[출석 종료 성공]');
            res.json({ result: result });
          } catch (error) {
            console.log('[출석 종료 실패]', error);
            console.log(error);
          }
        } else {
          console.log('[출석 종료 실패_진짜 출석 테이블 데이터 없음]');
          res.json({ result: false });
        }
      }
      console.log('[출석 종료 실패_관리자 아님]');
      res.json({ result: false });
    } catch (error) {
      console.log('[출석 종료 실패]', error);
      return res.json({ result: false });
    }
  },
  // 출결 수정
  updateAttend: async (req, res) => {
    const {user_id, attendType, session_id} = req.body;
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
        res.json({attends: attends});
      } else {
        console.log('[출석 정보 불러오기 실패]_관리자 권한 필요');
        res.json({attends: false});
      }
    } catch(error) {
      console.log('[출석 정보 불러오기 실패]', error);
      res.json({attends: false});
    }
  },
  getSessionAndAttend: async (req, res) => {
    const {userToken} = req.body;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const sessions = await attendModel.getSessionAndAttend(userInfo.user_id, userInfo.level);

      res.json({sessions: sessions});
    } catch(error) {
      console.log(error);
      res.json({sessions: false});
    }
  }
}