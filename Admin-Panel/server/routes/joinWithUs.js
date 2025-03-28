const sendEmail = require('../utils/emailService'); // You'll need to set up an email service

router.post('/accept-email', async (req, res) => {
  try {
    const { requestId, email, subject, message, status } = req.body;
    
    // Update request status
    await JoinWithUs.findByIdAndUpdate(requestId, { status });
    
    // Send email
    await sendEmail({
      to: email,
      subject,
      text: message
    });
    
    res.json({ success: true, message: 'Request accepted and email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

router.post('/reject-email', async (req, res) => {
  try {
    const { requestId, email, subject, message, status } = req.body;
    
    // Update request status
    await JoinWithUs.findByIdAndUpdate(requestId, { status });
    
    // Send email
    await sendEmail({
      to: email,
      subject,
      text: message
    });
    
    res.json({ success: true, message: 'Request rejected and email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
}); 