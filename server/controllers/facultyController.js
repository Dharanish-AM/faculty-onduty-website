const FacultyOD = require("../models/FacultyOD");

const submitFacultyOD = async (req, res) => {
  try {
    const {
      name,
      email,
      eventType,
      eventTitle,
      eventDescription,
      venue,
      fromDate,
      toDate,
    } = req.body;

    if (
      !name ||
      !email ||
      !eventType ||
      !eventTitle ||
      !eventDescription ||
      !venue ||
      !fromDate ||
      !toDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newSubmission = await FacultyOD.create({
      name,
      email,
      eventType,
      eventTitle,
      eventDescription,
      venue,
      fromDate,
      toDate,
    });

    console.log(
      `✅ New Faculty OD Submitted: ${newSubmission.name} (${newSubmission.email})`
    );

    return res.status(201).json({
      success: true,
      message: "Faculty OD form submitted successfully.",
      data: newSubmission,
    });
  } catch (error) {
    console.error("❌ Error submitting Faculty OD form:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit Faculty OD form.",
      error: error.message,
    });
  }
};

module.exports = { submitFacultyOD };
