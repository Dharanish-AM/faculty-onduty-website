const mongoose = require("mongoose");

const facultyODSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "Seminar",
        "Workshop",
        "Conference",
        "Symposium",
        "Training",
        "Other",
      ],
    },
    eventTitle: {
      type: String,
      required: true,
      trim: true,
    },
    eventDescription: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    submittedOn: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

const FacultyOD =
  mongoose.models.FacultyOD || mongoose.model("FacultyOD", facultyODSchema);

module.exports = FacultyOD;
