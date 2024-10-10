import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Create a new subject
router.post('/subjects', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const teacherId = req.teacher.teacherId;

  try {
    const subject = await prisma.subject.create({
      data: { name, teacherId },
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subject" });
  }
});

// Add a student to a subject
router.post('/subjects/:subjectId/students', authenticateToken, async (req, res) => {
  const { subjectId } = req.params;
  const { name, rollNumber, marks, COs, POs } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        name,
        rollNumber,
        marks,
        COs,
        POs,
        subjectId: parseInt(subjectId),
      },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to add student" });
  }
});

// Get students for a specific subject
router.get('/subjects/:subjectId/students', authenticateToken, async (req, res) => {
  const { subjectId } = req.params;

  try {
    const students = await prisma.student.findMany({
      where: { subjectId: parseInt(subjectId) },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

export default router;