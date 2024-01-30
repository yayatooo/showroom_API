const Sell = require("../models/sellAtModel");

const addSell = async (req, res) => {
  try {
    const { name, policeNumber, frameNumber, price, capitalPrice, dateOfSale } =
      req.body;

    // Create a new instance of the Sell model
    const sell = new Sell({
      name,
      policeNumber,
      frameNumber,
      price,
      capitalPrice,
    });

    // Save the new sell data to the database
    const newSell = await sell.save();

    res
      .status(201)
      .json({ message: "Sell data added successfully", data: newSell });
  } catch (error) {
    console.error("Error adding sell data:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSell = async (req, res) => {
  try {
    const sellData = await Sell.find({}, "-__v"); // Exclude '__v' field from the result
    res.status(200).json(sellData);
  } catch (error) {
    console.error("Error retrieving sell data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSellById = async (req, res) => {
  const sellId = req.params.id;

  try {
    const sellData = await Sell.findById(sellId);
    if (!sellData) {
      return res.status(404).json({ message: "Sell data not found" });
    }
    res.status(200).json(sellData);
  } catch (error) {
    console.error("Error retrieving sell data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteSell = async (req, res) => {
  try {
    const sellId = req.params.id;
    const deletedSell = await Sell.findByIdAndDelete(sellId);
    if (!deletedSell) {
      return res.status(404).json({ message: "Sell data not found" });
    }
    res
      .status(200)
      .json({ message: "Sell data deleted successfully", data: deletedSell });
  } catch (error) {
    console.error("Error deleting sell data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateSell = async (req, res) => {
  try {
    const sellId = req.params.id;
    const update = req.body;
    const updatedSell = await Sell.findByIdAndUpdate(sellId, update, {
      new: true,
    });
    if (!updatedSell) {
      return res.status(404).json({ message: "Sell data not found" });
    }
    res
      .status(200)
      .json({ message: "Sell data updated successfully", data: updatedSell });
  } catch (error) {
    console.error("Error updating sell data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getSell,
  addSell,
  getSellById,
  deleteSell,
  updateSell,
};
