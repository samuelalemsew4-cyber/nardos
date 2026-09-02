const ContactMessage = require('../models/ContactMessage');

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide name, email, subject, and message' });
    }

    const contactMessage = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', contactMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
