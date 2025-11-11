const express = require("express");
const {
  submitFacultyOD,
} = require("../controllers/facultyController");

const router = express.Router();

router.post("/submit", submitFacultyOD);

module.exports = router;
