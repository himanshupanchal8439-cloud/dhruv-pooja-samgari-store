const sendEmail = require('../utils/sendEmail');
const ContactMessage = require('../models/ContactMessage');

async function submitContact(req, res, next) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    if (name.length > 100 || email.length > 200 || message.length > 2000) {
      return res.status(400).json({ message: 'Input too long' });
    }

    await ContactMessage.create({ name, email, message });

    const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER;
    if (to) {
      sendEmail({
        to,
        subject: `New contact form message from ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a1a12;">
            <h2 style="color:#8a5a1b;">New message from the Contact Us form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap;">${message}</p>
          </div>`,
      }).catch((err) => console.error('Contact notification email failed:', err.message));
    }

    res.json({ message: 'Message sent' });
  } catch (err) {
    next(err);
  }
}

async function listContactMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

async function deleteContactMessage(req, res, next) {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact, listContactMessages, deleteContactMessage };
