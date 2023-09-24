const assignModel = require('../models/assignModel.js');

module.exports = {
    showAssign: async (req, res) => {
        const curUserData = req.body;
        const curUserId = curUserData.id; // or phone?
        const curUserLevel = curUserData.level;

        const gradeData = await assignModel.showGrade(curUserId);
        const assignData = await assignModel.showAssign(curUserLevel);

        // res.json({gradeData: gradeData, assignData: assignData});
    },
}