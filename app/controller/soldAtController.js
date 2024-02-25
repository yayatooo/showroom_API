const Sold = require("../models/soldAtModel");

const getSold = async (req, res) => {
  try {
    const sold = await Sold.find();
    res.json({ data: sold, message: "Success" });
  } catch (error) {
    console.error("Error fetching sold data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getSold };
