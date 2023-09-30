const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/notice')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
  
  const upload = multer({storage: storage}) //storage 설정을 사용하는 upload라는 이름의 multer 미들웨어 인스턴스 생성
  module.exports = upload;
  