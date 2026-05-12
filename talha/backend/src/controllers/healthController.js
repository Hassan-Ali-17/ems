const health = (req, res) => {
  res.json({ success: true, message: 'EMS API is healthy.', timestamp: new Date().toISOString() });
};

module.exports = { health };