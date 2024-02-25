const mongoose = require("mongoose");

const soldAtSchema = new mongoose.Schema(
  {
    soldData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sell",
      },
    ],
  },
  { timestamps: true }
);

const Sold = mongoose.model("sold", soldAtSchema);

module.exports = Sold;
