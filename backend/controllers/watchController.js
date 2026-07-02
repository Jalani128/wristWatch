import mongoose from "mongoose";
import Watch from "../model/watchModel.js";
import fs from "fs";
import path from "path";



const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000/';
// To create a watch

export async function createWatch(req, res) {
    try {
        const { name, description, price, category, brandName } = req.body;
        let image = req.body.image;
        if (req.file?.filename) image = `${API_BASE}uploads/${req.file.filename}`;
        if (!name || !description || !price || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const doc = new Watch({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            price,
            category,
            brandName,
            image,
        });
        const save = await doc.save();
        return res.status(201).json({
            success: true,
            message: "Watch created successfully",
            data: save,
        });

    }
    catch (err) {
        console.error("Error in createWatch controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// To fetch the watche
export async function getWatches(req, res) {
    try {
        const { category, sort = "createdAt", page = 1, limit = 12 } = req.query;
        const filter = {};
        // TO filter
        if (typeof category === "string") {
            const cat = category.trim().toLowerCase();
            if (cat === "men" || cat === "women") filter.category = cat;
        }

        const pg = Math.max(1, parseInt(page, 10) || 1);
        const lim = Math.min(200, parseInt(limit, 10) || 12);
        const skip = (pg - 1) * lim;

        const total = await Watch.countDocuments(filter);
        const watches = await Watch.find(filter).sort(sort).skip(skip).limit(lim).lean();

        return res.status(200).json({
            success: true,
            message: "Watches fetched successfully",
            data: watches,
            total,
            page: pg,
            limit: lim
        })

    }
    catch (err) {
        console.error("Error in getWatches controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
// to delete a watch and also remove the linked image the upload folder
export async function deleteWatch(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({
            success: false,
            message: "Watch id is required",
        });
        const w = await Watch.findById(id);
        if (!w) return res.status(404).json({
            success: false,
            message: "Watch not found",
        });
        if (w.image && typeof w.image === "string") {
            const normalized = w.image.startsWith("/") ? w.image.slice(1) : w.image;
            if (normalized.startsWith("uploads/")) {
                const filename = normalized.replace(/^uploads\//, "");
                const filepath = path.join(process.cwd(), "uploads", filename);
                fs.unlink(filepath, (err) => {
                    if (err) console.warn("Failed to unlink image file", filepath, err?.message || err);
                });
            }
        }
        await Watch.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Watch deleted successfully",
        });
    }
    catch (err) {
        console.error("Error in Delete Watche controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}

// to get watches by brand name
    export async function getWatchesByBrand(req, res) {
        try {
            const brandName = req.params.brandName;
            const items = await Watch.find({ brandName }).sort({ createdAt: -1 }).lean();
            return res.status(200).json({
                success: true,
                message: "Watches fetched successfully",
                data: items,
            })
    }
    catch (err) {
        console.error("Error in get Watches Brand Name controller:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
