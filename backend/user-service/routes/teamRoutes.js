// routes/teamRoutes.js
import express from "express";
import teamController from "../controllers/teamController.js";

const router = express.Router();
router.post('/', teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

export default router