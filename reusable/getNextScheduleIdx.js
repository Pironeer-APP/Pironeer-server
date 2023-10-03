module.exports = {
  getNextScheduleIdx: (sessions) => {
    // 요청 받을 당시 다가오는 일정 자동 스크롤을 위한
    let nextSessionIdx = null;
    const now = new Date();
    const nowYear = Number(now.getFullYear());
    const nowMonth = Number(now.getMonth().toLocaleString('ko')) + 1;
    const nowDay = Number(now.getDate().toLocaleString('ko'));
    // console.log('now...', nowYear, nowMonth, nowDay);
    for (let i = sessions.length - 1; i > 0; i--) {
      const sessionYear = Number(sessions[i].year.toLocaleString('ko'));
      const sessionMonth = Number(sessions[i].month.toLocaleString('ko'));
      const sessionDay = Number(sessions[i].day.toLocaleString('ko'));
      // console.log('session...', sessionYear, sessionMonth, sessionDay);
      if (sessionYear === nowYear
        && sessionMonth === nowMonth
        && sessionDay === nowDay) {
        nextSessionIdx = sessions[i].cnt - 1;
        break;
      }
      else if (sessionYear > nowYear
        || sessionMonth > nowMonth
        || (sessionMonth === nowMonth && sessionDay > nowDay)) {
        nextSessionIdx = sessions[i].cnt - 1;
        break;
      }
    }
    if (nextSessionIdx === null) nextSessionIdx = 0;
    // console.log(nextSessionIdx);

    return nextSessionIdx;
  }
}