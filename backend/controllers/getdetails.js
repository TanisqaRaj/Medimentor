import Doctor from "../models/Doctor.js";
import User from "../models/user.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔓 Decode Base64 Image
const decodeBase64 = (base64String) => {
    try {
        if (!base64String) return null;
        return base64String; // Image is already optimized using Sharp
    } catch (error) {
        console.error("❌ Decode Error:", error.message);
        return null;
    }
};

/**
 ✅ Function to check if the query is a symptom using AI
 */
const isSymptom = async (query) => {
    const lower = query.toLowerCase();
    return /\b(i have|pain|ache|fever|cold|dizzy|nausea|vomit|symptom|cough|suffering|infection)\b/.test(lower);
};

// ✅ Search Doctors
export const searchdoctor = async (req, res) => {
    const { query = '', page = 1, limit = 10, isDoctor } = req.query;
    const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let searchQuery = {};

    try {
        let professions = [];
        let departments = [];

        if (isDoctor !== 'true' && safeQuery) {
            const symptom = await isSymptom(safeQuery);
            console.log("🔍 Symptom Detected?", symptom);

            if (symptom) {
                // Fetch all professions & departments
                const profAgg = await Doctor.aggregate([
                    { $unwind: "$profession" },
                    { $group: { _id: null, professions: { $addToSet: "$profession" } } },
                    { $project: { _id: 0, professions: 1 } },
                ]);
                const deptAgg = await Doctor.aggregate([
                    { $group: { _id: null, departments: { $addToSet: "$department" } } },
                    { $project: { _id: 0, departments: 1 } },
                ]);
                professions = profAgg[0]?.professions || [];
                departments = deptAgg[0]?.departments || [];

                // Ask AI to match
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const prompt = `
A patient reports: "${query}"
Choose from:
  professions: ${JSON.stringify(professions)}
  departments: ${JSON.stringify(departments)}
Return exactly:
  { "professions": [...], "departments": [...] }
          `.trim();

                    const aiResp = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: prompt }] }]
                    });
                    const raw = aiResp.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                    let parsed = { professions: [], departments: [] };
                    try {
                        parsed = JSON.parse(raw);
                    } catch (e) {
                        console.error("❌ AI JSON Parse Error:", raw);
                    }

                    professions = Array.isArray(parsed.professions) ? parsed.professions : [];
                    departments = Array.isArray(parsed.departments) ? parsed.departments : [];
                } catch (aiErr) {
                    console.error("❌ AI Fetch Error:", aiErr.message);
                }

                const orQuery = [];
                if (professions.length) orQuery.push({ profession: { $in: professions } });
                if (departments.length) orQuery.push({ department: { $in: departments } });

                if (orQuery.length) {
                    searchQuery = { $or: orQuery };
                } else {
                    searchQuery = {
                        $or: [
                            { profession: { $regex: safeQuery, $options: 'i' } },
                            { department: { $regex: safeQuery, $options: 'i' } }
                        ]
                    };
                }
            }
        }

        // Fallback or normal doctor search
        if (!Object.keys(searchQuery).length) {
            const regex = new RegExp(safeQuery, 'i');
            searchQuery = {
                $or: [
                    { name: regex },
                    { profession: regex },
                    { department: regex }
                ]
            };
        }

        console.log("🧾 Final MongoDB Query:", JSON.stringify(searchQuery, null, 2));

        const doctors = await Doctor.find(searchQuery)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .select("image name department profession doctorId");

        const doctorsWithImages = doctors.map((doc) => ({
            ...doc.toObject(),
            image: decodeBase64(doc.image),
        }));

        res.status(200).json({
            success: true,
            totalResults: doctorsWithImages.length,
            professions,
            departments,
            page: Number(page),
            doctors: doctorsWithImages
        });
    } catch (err) {
        console.error("❌ searchdoctor Error:", err.message);
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
};


// ✅ Get All Doctors with Optimized Images
export const getDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10, lastId } = req.query;

        let filter = {};
        if (lastId) {
            filter = { _id: { $gt: lastId } }; // Fetch doctors after last seen _id
        }

        const doctors = await Doctor.find(filter)
            .sort({ _id: 1 })
            .limit(parseInt(limit))
            .select("image name rating fee bio profession doctorId");

        const totalDoctors = await Doctor.countDocuments();

        // ✅ Return Optimized Images
        const doctorsWithImages = doctors.map((doctor) => ({
            ...doctor.toObject(),
            image: decodeBase64(doctor.image), // Return Base64 as is (already optimized)
        }));

        console.log("📥 Fetched Doctors:", doctorsWithImages.length);

        res.status(200).json({
            success: true,
            totalDoctors,
            doctors: doctorsWithImages,
            lastId: doctorsWithImages.length ? doctorsWithImages[doctorsWithImages.length - 1]._id : null,
        });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: " + error.message });
    }
};

// ✅ Get Total Number of Doctors
export const getTotalDoctors = async (req, res) => {
    try {
        const totalDoctors = await Doctor.countDocuments();
        res.status(200).json({
            success: true,
            totalDoctors,
        });
    } catch (error) {
        res.status(500).json({ message: "❌ Server Error: " + error.message });
    }
};

//get total number of users

export const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({
            success: true,
            totalUsers,
        });
    }
    catch (error) {
        res.status(500).json({ message: " server Error : " + error.message });
    };

};