const { Case, User, Setting, Log } = require('../../models/legal/caseTracker');

// CASE
exports.getCases = async (req, res) => {
  const cases = await Case.find();
  res.json(cases);
};

exports.createCase = async (req, res) => {
  const newCase = new Case(req.body);
  await newCase.save();
  res.status(201).json(newCase);
};

exports.updateCase = async (req, res) => {
  const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteCases = async (req, res) => {
  await Case.deleteMany({ _id: { $in: req.body.ids } });
  res.json({ message: 'Cases deleted' });
};

// USER
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
};

exports.updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteUsers = async (req, res) => {
  await User.deleteMany({ _id: { $in: req.body.ids } });
  res.json({ message: 'Users deleted' });
};

// SETTINGS
exports.getSettings = async (req, res) => {
  const settings = await Setting.findOne();
  res.json(settings);
};

exports.saveSettings = async (req, res) => {
  let settings = await Setting.findOne();
  if (settings) {
    await Setting.updateOne({}, req.body);
  } else {
    settings = new Setting(req.body);
    await settings.save();
  }
  res.json({ message: 'Settings saved' });
};

// LOGS
exports.getLogs = async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 });
  res.json(logs);
};

exports.createLog = async (req, res) => {
  const newLog = new Log(req.body);
  await newLog.save();
  res.status(201).json(newLog);
};
