const assignModel = require('../models/assignModel.js');

module.exports = {
    showAssign: async (req, res) => {
        const curUserLevel = Number(req.params.level); // level get
        const curUserId = null; // id 임시처리

        const data = await assignModel.showAssign(curUserLevel, curUserId);

        // id, date, day, title, status(donggrami, semo, ex), done(진행 중인지 여부)
        res.json({data: data});
    },
}