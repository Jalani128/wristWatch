import express from "express";
import multer from "multer";
import path from "path";


const watchRouter = express.Router();

import {createWatch} from "../controllers/watchController.js";
import {getWatches} from "../controllers/watchController.js";
import {deleteWatch} from "../controllers/watchController.js";
import {getWatchesByBrand} from "../controllers/watchController.js";

// multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `watch-${unique}${ext}`);
    },  

})
const upload = multer({ storage });

watchRouter.post("/", upload.single("image"), createWatch);
watchRouter.get("/", getWatches);
watchRouter.delete("/:id", deleteWatch);
watchRouter.get("/brands/:brandName", getWatchesByBrand);

export default watchRouter;

