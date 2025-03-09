import express from "express";
import studentResumeController from "../controllers/studentResumeController.js";

const router = express.Router();
const student_path = "api/student"

router.post(`${student_path}/`, studentResumeController.createStudentResume);
router.get(`${student_path}/`, studentResumeController.getAllStudentResumes);
router.get('/:id', studentResumeController.getStudentResumeById);
router.put('/:id', studentResumeController.updateStudentResume);
router.delete('/:id', studentResumeController.deleteStudentResume);

export default router;
