const healthcheck = async (req, res, next) => {
  res.status(200).json({
    status: 'OK',
  });
};

module.exports = { healthcheck };
