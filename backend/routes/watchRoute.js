import express from "express";
import multer from "multer";

const watchRouter = express.Router();

import { createWatch } from "../controllers/watchController.js";
import { getWatches } from "../controllers/watchController.js";
import { deleteWatch } from "../controllers/watchController.js";
import { getWatchesByBrand } from "../controllers/watchController.js";

// multer setup — memory storage (files go to Vercel Blob, not local disk)
const upload = multer({ storage: multer.memoryStorage() });

watchRouter.post("/", upload.single("image"), createWatch);
watchRouter.get("/", getWatches);
watchRouter.delete("/:id", deleteWatch);
watchRouter.get("/brands/:brandName", getWatchesByBrand);

export default watchRouter;