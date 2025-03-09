// routes/tutorResumeRoutes.js
import express from "express";
import tutorResumeController from "../controllers/tutorResumeController.js";

const router = express.Router();
router.post('/', tutorResumeController.createTutorResume);
router.get('/', tutorResumeController.getAllTutorResumes);
router.get('/:id', tutorResumeController.getTutorResumeById);
router.put('/:id', tutorResumeController.updateTutorResume);
router.delete('/:id', tutorResumeController.deleteTutorResume);

export default router