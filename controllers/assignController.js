const assignModel = require('../models/assignModel.js');

module.exports = {
    showAssign: async (req, res) => {
        const curUserLevel = Number(req.params.level); // level get
        const curUserId = null; // id

        const assignData = await assignModel.showAssign(curUserLevel);
        const gradeData = await assignModel.showGrade(curUserId);

        res.json({gradeData: gradeData, assignData: assignData});
    },
}