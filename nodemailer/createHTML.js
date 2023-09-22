module.exports = (newUserData, randPassword) => {
  return (`
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  
  <body>
    <div style="margin: 2rem;">
      <img src="cid:unique@nodemailer.com" style="width: 40px; height: 40px;" />
      <h2 style="height: 40px;">${newUserData.name}님, 환영합니다!</h2>
      <h2 style="height: 40px;">피로그래밍 계정 정보를 안내해 드려요</h2>
      <table>
        <tr>
          <td>아이디(전화번호)</td>
          <td>${newUserData.phone}</td>
        </tr>
        <tr>
          <td>비밀번호</td>
          <td>${randPassword}</td>
        </tr>
      </table>
      <br />
      <b style="color: red;">개인 정보 보호를 위해 로그인 후 비밀 번호를 변경해 주세요</b>
    </div>
  </body>
  
  </html>`);
}