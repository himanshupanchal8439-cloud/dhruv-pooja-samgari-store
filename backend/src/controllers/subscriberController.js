const Subscriber = require('../models/Subscriber');

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email is required' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) return res.json({ message: 'Already subscribed' });

    await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    next(err);
  }
}

async function listSubscribers(req, res, next) {
  try {
    const subscribers = await Subscriber.find().sort('-createdAt');
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
}

async function deleteSubscriber(req, res, next) {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, listSubscribers, deleteSubscriber };
