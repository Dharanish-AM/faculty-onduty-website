const express = require("express");
const { signupAdmin, loginAdmin,getAllSubmissions } = require("../controllers/adminController");

const router = express.Router();

router.post("/signup", signupAdmin);

router.post("/login", loginAdmin);

router.get("/submissions", getAllSubmissions)

module.exports = router;
