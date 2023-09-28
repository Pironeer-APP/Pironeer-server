const attendModel = require('../models/attendModel.js');

module.exports = {
  generateCode: async (req, res) => {
    const bodyData = req.body;
    // 관리자만 생성할 수 있도록
    if (bodyData.is_admin) {
      const code = await attendModel.generateCode();
      res.json({ code: code });
    } else {
      res.json({ code: false });
    }
  },
  // 회원들이 출석 코드를 입력하고 출석 버튼을 눌렀을 때
  addAttend: async (req, res) => {
    const bodyData = req.body;
    const user_id = bodyData.user_id;
    const input_code = bodyData.input_code;

    try {
      const code = await attendModel.getCode();
      // 생성된 코드가 있고, 코드와 입력된 코드가 같으면 출석
      if (code && code === input_code) {
        const result = await attendModel.addTempAttend(user_id, '출석');
        return res.json({ result: result });
      }
    } catch (error) {
      console.log(error);
      return res.json({ result: false });
    }
  },
  // 출결 저장 버튼을 눌렀을 때
  confirmAttend: async (req, res) => {
    const is_admin = req.body.is_admin;
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
        res.json({ result: result });
      } catch (error) {
        console.log(error);
      }
    }
    res.json({ result: false });
  },
  // 출결 종료 버튼을 눌렀을 때
  endAttend: async (req, res) => {
    const is_admin = req.body.is_admin;
    const session_id = req.body.session_id;
    if (is_admin) {

      const attends = await attendModel.getSessionAttend(session_id);

      if (attends) {
        try {
          // 세 번째 출결
          const result = await attendModel.addNextAttend(session_id, 3);
          res.json({ result: result });
        } catch (error) {
          console.log(error);
        }
      } else {
        res.json({ result: false });
      }
    }
    res.json({ result: false });
  }
}