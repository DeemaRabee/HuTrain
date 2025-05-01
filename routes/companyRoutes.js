console.log("company rout");
const express = require('express');
const { validate } = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');
const Joi = require('joi');

const uploadImage = require('../middleware/uploadCompanyProfilePicture'); // لرفع صورة الشركة
const uploadCompanyActivityReport = require('../middleware/uploadCompanyActivityReport'); // لرفع تقارير النشاط
const uploadCompanyFinalReport = require('../middleware/uploadCompanyFinalReport'); // لرفع التقرير النهائي

const {
  getCompanies,
  getCompany,
  updateProfile,
  getCompanyPosts,
  getCompanyApplications,
  //getSingleApplication,
  updateApplicationStatus,
  submitActivityReport,
  submitFinalReport
} = require('../controllers/companyController');

const router = express.Router();

// —————————————————————————
// ✅ Schemas
const updateProfileSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  location: Joi.string(),
  fieldOfWork: Joi.string()
});

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required()
});

// —————————————————————————
// ✅ حماية كل المسارات
router.use(protect);

// —————————————————————————
// ✅ مسارات الأدمن
router.get('/', restrictTo('admin'), getCompanies);
router.get('/:id', restrictTo('admin'), getCompany);

// —————————————————————————
// ✅ مسارات الشركة
router.put(
  '/profile',
  restrictTo('company'),
  uploadImage.single('profilePicture'), // صورة البروفايل
  validate(updateProfileSchema),
  updateProfile
);

router.get('/posts', restrictTo('company'), getCompanyPosts);
router.get('/applications', restrictTo('company'), getCompanyApplications);
//router.get('/applications/:id', restrictTo('company'), getSingleApplication);

router.put(
  '/applications/:id',
  restrictTo('company'),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);

// ➡️ رفع تقرير نشاط
router.post(
  '/applications/:id/activity',
  restrictTo('company'),
  uploadCompanyActivityReport.single('activityReport'),
  submitActivityReport
);

// ➡️ رفع تقرير نهائي
router.post(
  '/applications/:id/final',
  restrictTo('company'),
  uploadCompanyFinalReport.single('finalReport'),
  submitFinalReport
);

module.exports = router;

// 📂 routes/companyRoutes.js
/*
const express = require('express');
const { validate } = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');
const Joi = require('joi');
const multer = require('multer');

const uploadImage = require('../middleware/uploadCompanyProfilePicture'); // ✅ رفع صورة الشركة
const uploadCompanyActivityReport = require('../middleware/uploadCompanyActivityReport'); // ✅ رفع تقرير الأداء PDF
const {
  getCompanies,
  getCompany,
  updateProfile,
  getCompanyPosts,
  getCompanyApplications,
  getSingleApplication,
  updateApplicationStatus,
  submitActivityReport
  //uploadTrainingReport
} = require('../controllers/companyController');

const router = express.Router();

// —————————————————————————
// ✅ Schemas

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  location: Joi.string(),
  fieldOfWork: Joi.string()
});

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required()
});

// —————————————————————————
// ✅ الحماية لكل المسارات
router.use(protect);

// —————————————————————————
// ✅ مسارات الأدمن
router.get('/', restrictTo('admin'), getCompanies);
router.get('/:id', restrictTo('admin'), getCompany);

// —————————————————————————
// ✅ مسارات الشركة

// ➡️ تعديل بروفايل الشركة
router.put(
  '/profile',
  restrictTo('company'),
  uploadImage.single('profilePicture'), // ✅ استقبال صورة جديدة
  validate(updateProfileSchema),
  updateProfile
);

// ➡️ عرض إعلانات التدريب الخاصة بالشركة
router.get('/posts', restrictTo('company'), getCompanyPosts);

// ➡️ عرض جميع الطلبات المقدمة للشركة
router.get('/applications', restrictTo('company'), getCompanyApplications);

// ➡️ عرض طلب مفصل
router.get('/applications/:id', restrictTo('company'), getSingleApplication);

// ➡️ تحديث حالة طلب (موافقة/رفض)
router.put(
  '/applications/:id',
  restrictTo('company'),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);

// ➡️ رفع تقرير أداء الطالب
router.post(
  '/applications/:id/report',
  restrictTo('company'),
  uploadCompanyActivityReport.single('reportFile'),
  submitActivityReport
  //uploadTrainingReport
);

// —————————————————————————

module.exports = router;

*/




//تعديل اخر نسخه 
/*const express = require('express');
const { validate } = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');
const Joi = require('joi');
const uploadPDF = require('../middlewares/pdfUpload'); // ✨ لرفع تقارير الأداء PDF
const uploadImage = require('../middlewares/imageUpload'); // ✨ لتحميل صورة الشركة
const {
  getCompanies,
  getCompany,
  updateProfile,
  getCompanyPosts,
  getCompanyApplications,
  getSingleApplication,
  updateApplicationStatus,
  uploadTrainingReport
} = require('../controllers/companyController');

const router = express.Router();

// —————————————————————————
// مخططات التحقق

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  location: Joi.string(),
  fieldOfWork: Joi.string()
});

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required()
});

// —————————————————————————
// حماية كل المسارات
router.use(protect);

// مسارات الأدمين
router.get('/', restrictTo('admin'), getCompanies);
router.get('/:id', restrictTo('admin'), getCompany);

// مسارات الشركة
router.put(
  '/profile',
  restrictTo('company'),
  uploadImage.single('profilePicture'), // ✨ استقبال صورة جديدة
  validate(updateProfileSchema),
  updateProfile
);

router.get('/posts', restrictTo('company'), getCompanyPosts);
router.get('/applications', restrictTo('company'), getCompanyApplications);
router.get('/applications/:id', restrictTo('company'), getSingleApplication);

router.put(
  '/applications/:id',
  restrictTo('company'),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);

// رفع تقرير أداء (PDF)
router.post(
  '/applications/:id/report',
  restrictTo('company'),
  uploadPDF.single('reportFile'),
  uploadTrainingReport
);

// —————————————————————————

module.exports = router;

*/























/*
const express = require('express');
const { validate } = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');
const Joi = require('joi');
const {
  getCompanies,
  getCompany,
  updateProfile,
  getCompanyPosts,
  getCompanyApplications,
  updateApplicationStatus,
  submitApprovalFiles,
  submitActivityReport
} = require('../controllers/companyController');

const router = express.Router();

// مخططات التحقق
const updateProfileSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  location: Joi.string(),
  fieldOfWork: Joi.string()
});

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required()
});

const submitFileSchema = Joi.object({
  fileContent: Joi.string().required()
});

// حماية جميع المسارات
router.use(protect);

// مسارات المسؤول
router.get('/', restrictTo('admin'), getCompanies);
router.get('/:id', restrictTo('admin'), getCompany);

// مسارات الشركة
router.put('/profile', restrictTo('company'), validate(updateProfileSchema), updateProfile);
router.get('/posts', restrictTo('company'), getCompanyPosts);
router.get('/applications', restrictTo('company'), getCompanyApplications);
router.put('/applications/:id', restrictTo('company'), validate(updateApplicationStatusSchema), updateApplicationStatus);
router.post('/applications/:id/approval', restrictTo('company'), validate(submitFileSchema), submitApprovalFiles);
router.post('/applications/:id/activity', restrictTo('company'), validate(submitFileSchema), submitActivityReport);

module.exports = router;*/