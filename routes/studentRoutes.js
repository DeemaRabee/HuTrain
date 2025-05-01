// 📂 routes/studentRoutes.js
console.log("stu rout");
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const multer = require('multer');

const uploadStudentCV = require('../middleware/uploadStudentCV');
const uploadStudentFinalReport = require('../middleware/uploadStudentFinalReport');
const {
  getAvailablePosts,
  applyForTraining,
  getStudentApplications,
  selectApplication,
  submitFinalReport
} = require('../controllers/studentController');

const router = express.Router();

// —————————————————————————
// ✅ حماية جميع المسارات
router.use(protect);
router.use(restrictTo('student'));

// —————————————————————————
// ✅ مسارات الطالب

// ➡️ الحصول على بوستات التدريب المتاحة
router.get('/posts', getAvailablePosts);

// ➡️ التقديم على بوست تدريب مع رفع CV
router.post('/posts/:id/apply', uploadStudentCV.single('cv'), applyForTraining);

// ➡️ عرض جميع طلبات الطالب
router.get('/applications', getStudentApplications);

// ➡️ اختيار طلب معين
router.put('/applications/:id/select', selectApplication);

// ➡️ رفع تقرير التدريب النهائي
router.post('/training/report', uploadStudentFinalReport.single('finalReport'), submitFinalReport);

// —————————————————————————

module.exports = router;




//تعديل اخر نسخه 

/*const express = require('express');
const { validate } = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const {
  getAvailablePosts,
  applyForTraining,
  getStudentApplications,
  selectApplication,
  submitFinalReport
} = require('../controllers/studentController');

const router = express.Router();

// —————————————————————————
// إعداد تخزين لرفع ملفات السيرة الذاتية
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// إعداد تخزين لرفع التقارير النهائية PDF
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/finalReports');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// فلترة الملفات
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, or DOCX files are allowed'), false);
  }
};

const uploadCV = multer({
  storage: cvStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadReport = multer({
  storage: reportStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// —————————————————————————
// حماية جميع المسارات
router.use(protect);
router.use(restrictTo('student'));

// مسارات الطالب
router.get('/posts', getAvailablePosts);
router.post('/posts/:id/apply', uploadCV.single('cv'), applyForTraining);
router.get('/applications', getStudentApplications);
router.put('/applications/:id/select', selectApplication);

// رفع تقرير التدريب النهائي PDF
router.post('/training/report', uploadReport.single('finalReport'), submitFinalReport);

module.exports = router;
*/



/*const express = require('express');
const { validate } = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const {
  getAvailablePosts,
  applyForTraining,
  getStudentApplications,
  selectApplication,
  submitFinalReport
} = require('../controllers/studentController');

const router = express.Router();

// إعداد تخزين multer لرفع ملفات السيرة الذاتية
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // قبول ملفات pdf و doc/docx فقط
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, or DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// مخططات التحقق
const submitReportSchema = Joi.object({
  reportContent: Joi.string().required()
});

// حماية جميع المسارات
router.use(protect);
router.use(restrictTo('student'));

// مسارات الطالب
router.get('/posts', getAvailablePosts);
router.post('/posts/:id/apply', upload.single('cv'), applyForTraining);
router.get('/applications', getStudentApplications);
router.put('/applications/:id/select', selectApplication);
router.post('/training/report', validate(submitReportSchema), submitFinalReport);

module.exports = router;*/