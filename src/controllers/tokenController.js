const Token = require('../models/Token');

const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: 1 }).lean();
    return res.json({
      tokens: tokens || [],
    });
  } catch (error) {
    return res.status(400).json({ error, message: "Server's error" });
  }
};

const addToken = async (req, res) => {
  try {
    try {
      const params = req.body;
      const tokenObject = {
        accessToken: params.accessToken,
      };
      // create and store new user
      const token = await Token.create(tokenObject);
      if (token) {
        return res.status(201).json({
          message: `Add successfully`,
        });
      } else {
        return res.status(400).json({
          message: 'Add fail',
        });
      }
    } catch (error) {
      return res.status(400).json({ error, message: "Server's error" });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllTokens,
  addToken,
};
