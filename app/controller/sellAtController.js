const Sell = require("../models/sellAtModel");
const Category = require("../models/categoryBikeModel");

const addSell = async (req, res) => {
  try {
    const {
      name,
      policeNumber,
      frameNumber,
      price,
      capitalPrice,
      categoryBike,
    } = req.body;

    if (!categoryBike) {
      return res.status(400).json({ error: "Category Bike is required" });
    }

    const category = await Category.findOneAndUpdate(
      { name: categoryBike },
      {},
      { new: true, upsert: true }
    );

    const newSell = new Sell({
      name,
      policeNumber,
      frameNumber,
      price,
      capitalPrice,
      categoryBike: category._id,
    });

    console.log(categoryBike);

    await newSell.save();
    return res
      .status(201)
      .json({ message: "Sell data added successfully", data: newSell });
  } catch (error) {
    console.error("Error adding sell data:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSell = async (req, res, next) => {
  try {
    let { category, skip = 0, limit = 10 } = req.query;

    const filterCriteria = {};

    if (category) {
      const categoryBike = await Category.findOne({ name: category });
      if (!categoryBike) {
        return res
          .status(404)
          .json({ message: `Category ${category} not found` });
      }
      filterCriteria.category = categoryBike._id;
    }

    let [sells, count] = await Promise.all([
      Sell.find(filterCriteria)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate("category")
        .sort("-createdAt")
        .exec(),
      Sell.countDocuments(filterCriteria),
    ]);

    return res.json({
      data: sells,
      count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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
