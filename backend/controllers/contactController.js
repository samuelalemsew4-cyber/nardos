const ContactMessage = require('../models/ContactMessage');
const { sendContactEmail } = require('../utils/emailService');

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide name, email, subject, and message' });
    }

    const contactMessage = await ContactMessage.create({ name, email, subject, message });
    let emailSent = false;

    try {
      emailSent = await sendContactEmail({ name, email, subject, message });
    } catch (emailError) {
      console.error('Contact email delivery failed:', emailError.message);
    }

    res.status(201).json({
      message: emailSent
        ? 'Message sent successfully'
        : 'Message saved successfully. Email delivery is not configured yet.',
      contactMessage,
      emailSent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
