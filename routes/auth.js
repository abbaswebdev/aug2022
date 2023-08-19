import express from "express";


import { routpage } from "../controller/authcontroller.js";

const router = express.Router();



router.route("/rout").get(routpage);

export default router;











