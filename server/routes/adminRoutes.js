const express = require("express");
const { signupAdmin, loginAdmin,getAllSubmissions, editSubmission, deleteSubmission } = require("../controllers/adminController");

const router = express.Router();

router.post("/signup", signupAdmin);

router.post("/login", loginAdmin);

router.get("/submissions", getAllSubmissions)

router.put("/edit-submission/:id", editSubmission);

router.delete("/delete-submission/:id", deleteSubmission);

module.exports = router;
