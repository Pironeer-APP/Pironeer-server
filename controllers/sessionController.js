const sessionModel = require('../models/sessionModel');

module.exports = {
  addSchedule: async (req, res) => {
    const schedule = req.body;
    const result = await sessionModel.addSchedule(schedule);

    res.json({result: result});
  }
}