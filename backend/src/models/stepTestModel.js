const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundNo: {
    type: Number,
    required: true,
  },
  stepTest: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const stepTestSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  dma: {
    type: String,
    required: true,
  },
  houseNumber: {
    type: String,
    required: true,
  },
  villageNo: {
    type: Number,
    required: true,
  },
  subdistrict: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  rounds: [roundSchema],
  images: [String],
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("StepTest", stepTestSchema);
