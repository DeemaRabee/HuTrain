//تعديل اخر نسخه 
// 📂 controllers/authController.js (نسخة شاملة ومحدثة بالكامل)
console.log("auth cont");
const User = require('../models/User');
const Company = require('../models/Company');
const Student = require('../models/Student');
const DepartmentHead = require('../models/DepartmentHead');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const MinistryService = require('../external/ministryService');
const logger = require('../utils/logger');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ———————————————————————————————————

// Helper to send JWT Token
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return ApiResponse.success(res, message, {
    token,
    user: { id: user._id, email: user.email, role: user.role }
  }, statusCode);
};

// ———————————————————————————————————
//***********************************************
//  */

// @desc    Register new Company
// @route   POST /api/auth/register/company
// @access  Public
/*exports.registerCompany = async (req, res, next) => {
  try {
    if (req.file) {
      console.log(`Uploaded file: ${req.file.filename}`);
    }

    const { nationalId, name, phone, location, fieldOfWork, email, password } = req.body;

    if (!nationalId.match(/^\d{9}$/)) {
      return next(new ApiError(400, 'National ID must be 9 digits'));
    }

    const existingCompany = await Company.findOne({ nationalId });
    if (existingCompany) {
      return next(new ApiError(400, 'Company with this National ID already exists'));
    }

    const verificationResult = await MinistryService.verifyCompany(nationalId);
    if (!verificationResult.verified) {
      return next(new ApiError(400, 'Company verification failed.'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email is already in use'));
    }

    const user = await User.create({
      email,
      password,
      role: 'company',
      nationalId
    });

    const company = await Company.create({
      user: user._id,
      nationalId,
      name,
      phone,
      location,
      fieldOfWork,
      profilePicture: req.file ? req.file.filename : undefined, // ← إضافة تخزين اسم الصورة
      verified: true
    });

    logger.info(`New company registered: ${name} (${nationalId})`);

    sendTokenResponse(user, 201, res, 'Company registered successfully');
  } catch (error) {
    next(error);
  }}
*/







//***************** */
// @desc    Register new Company
// @route   POST /api/auth/register/company
// @access  Public

exports.registerCompany = async (req, res, next) => {
  try {
    const { nationalId, name, phone, location, fieldOfWork, email, password } = req.body;

    if (!nationalId.match(/^\d{9}$/)) {
      return next(new ApiError(400, 'National ID must be 9 digits'));
    }

    const existingCompany = await Company.findOne({ nationalId });
    if (existingCompany) {
      return next(new ApiError(400, 'Company with this National ID already exists'));
    }

    const verificationResult = await MinistryService.verifyCompany(nationalId);
    if (!verificationResult.verified) {
      return next(new ApiError(400, 'Company verification failed.'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email is already in use'));
    }

    const user = await User.create({
      email,
      password,
      role: 'company',
      nationalId
    });

    const company = await Company.create({
      user: user._id,
      nationalId,
      name,
      phone,
      location,
      fieldOfWork,
      profilePicture: req.file ? req.file.filename : undefined,
      verified: true
    });

    
    logger.info(`New company registered: ${name} (${nationalId})`);

    sendTokenResponse(user, 201, res, 'Company registered successfully');
  } catch (error) {
    next(error);
  }
};

// ———————————————————————————————————

// @desc    Company Login
// @route   POST /api/auth/login/company
// @access  Public
exports.loginCompany = async (req, res, next) => {
  try {
    const { nationalId, password } = req.body;

    if (!nationalId || !password) {
      return next(new ApiError(400, 'Please provide national ID and password'));
    }

    const user = await User.findOne({ nationalId, role: 'company' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    sendTokenResponse(user, 200, res, 'Company logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Student Login
// @route   POST /api/auth/login/student
// @access  Public
// 📂 controllers/authController.js (جزء تسجيل الدخول)
exports.loginStudent = async (req, res, next) => {
  try {
    const { universityId, studentId, password } = req.body;
    const inputId = universityId || studentId;

    if (!inputId || !password) {
      return next(new ApiError(400, 'Please provide university ID and password'));
    }

    const user = await User.findOne({ studentId: inputId, role: 'student' }).select('+password');
    if (!user) return next(new ApiError(401, 'Invalid university ID'));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new ApiError(401, 'Invalid password'));

    sendTokenResponse(user, 200, res, 'Student logged in successfully');
  } catch (error) {
    next(error);
  }
};

/*exports.loginStudent = async (req, res, next) => {
  try {
    const {universityId ,studentId,  password } = req.body;

// خلي واحد منهم يمسك القيمة
const inputId = universityId || studentId;
if (!inputId ) {
  return next(new ApiError(400, 'Please provide university ID '));
}
if ( !password) {
      return next(new ApiError(400, 'Please provide  password'));
    }

    const user = await User.findOne({ studentId: inputId, role: 'student' }).select('+password');
    if (!user ) {
      return next(new ApiError(401, 'Invalid username'));
    }
    if ( !(await user.matchPassword(password))) {
      return next(new ApiError(401, 'Invalid password'));
    }

    sendTokenResponse(user, 200, res, 'Student logged in successfully');
  } catch (error) {
    next(error);
  }
};
*/
// @desc    Department Head Login
// @route   POST /api/auth/login/department-head
// @access  Public
exports.loginDepartmentHead = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    const user = await User.findOne({ email, role: 'department-head' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    sendTokenResponse(user, 200, res, 'Department Head logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    let profile;
    switch (user.role) {
      case 'company':
        profile = await Company.findOne({ user: user._id });
        break;
      case 'student':
        profile = await Student.findOne({ user: user._id });
        break;
      case 'department-head':
        profile = await DepartmentHead.findOne({ user: user._id });
        break;
    }

    ApiResponse.success(res, 'User retrieved successfully', { user, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Password
// @route   PUT /api/auth/updatepassword
// @access  Private
/*exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return next(new ApiError(401, 'Current password is incorrect'));
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    logger.info(`Password updated for user: ${user.email}`);

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};
*/
// ———————————————————————————————————

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError(404, 'There is no user with that email'));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease make a PUT request to:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ApiError(500, 'Email could not be sent'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ApiError(400, 'Invalid token'));
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};
















/*const User = require('../models/User');
const Company = require('../models/Company');
const Student = require('../models/Student');
const DepartmentHead = require('../models/DepartmentHead');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const MinistryService = require('../external/ministryService');
const logger = require('../utils/logger');

// دالة مساعدة لإرسال استجابة رمز JWT
const sendTokenResponse = (user, statusCode, res, message) => {
  // إنشاء الرمز
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return ApiResponse.success(
    res,
    message,
    { token, user: { id: user._id, email: user.email, role: user.role } },
    statusCode
  );
};*/

// @desc    تسجيل شركة
// @route   POST /api/auth/register/company
// @access  Public
/*
exports.registerCompany = async (req, res, next) => {
  try {
    const { nationalId, name, phone, location, fieldOfWork, email, password } = req.body;

    // التحقق من تنسيق الرقم الوطني (10 أرقام)
    if (!nationalId.match(/^\d{10}$/)) {
      return next(new ApiError(400, 'National ID must be 10 digits'));
    }

    // التحقق مما إذا كانت الشركة موجودة بالفعل
    const existingCompany = await Company.findOne({ nationalId });
    if (existingCompany) {
      return next(new ApiError(400, 'Company with this National ID already exists'));
    }

    // التحقق من الشركة مع خدمة الوزارة
    const verificationResult = await MinistryService.verifyCompany(nationalId);
    if (!verificationResult.verified) {
      return next(new ApiError(400, 'Company verification failed. Please ensure your National ID is registered with the Ministry of Industry and Trade.'));
    }

    // التحقق مما إذا كان البريد الإلكتروني قيد الاستخدام بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email is already in use'));
    }

    // إنشاء المستخدم
    const user = await User.create({
      email,
      password,
      role: 'company'
    });

    // إنشاء ملف تعريف الشركة
    const company = await Company.create({
      user: user._id,
      nationalId,
      name,
      phone,
      location,
      fieldOfWork,
      verified: true // حيث تم التحقق منها من قبل الوزارة
    });

    logger.info(`New company registered: ${name} (${nationalId})`);

    sendTokenResponse(user, 201, res, 'Company registered successfully');
  } catch (error) {
    next(error);
  }
};*/





// controllers/authController.js (داخل ملف authController.js)
/*exports.registerCompany = async (req, res, next) => {
  try {
    const { nationalId, name, phone, location, fieldOfWork, email, password } = req.body;

    // التحقق من تنسيق الرقم الوطني (9 أرقام)
    if (!nationalId.match(/^\d{9}$/)) {
      return next(new ApiError(400, 'National ID must be 9 digits'));
    }

    const existingCompany = await Company.findOne({ nationalId });
    if (existingCompany) {
      return next(new ApiError(400, 'Company with this National ID already exists'));
    }

    const verificationResult = await MinistryService.verifyCompany(nationalId);
    if (!verificationResult.verified) {
      return next(new ApiError(400, 'Company verification failed. Please ensure your National ID is registered with the Ministry.'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email is already in use'));
    }

    const user = await User.create({
      email,
      password,
      role: 'company',
      nationalId
    });

    const company = await Company.create({
      user: user._id,
      nationalId,
      name,
      phone,
      location,
      fieldOfWork,
      companyProfilePicture: req.file.filename, // ← إضافة تخزين اسم الصورة
      verified: true
    });

    logger.info(`New company registered: ${name} (${nationalId})`);

    sendTokenResponse(user, 201, res, 'Company registered successfully');
  } catch (error) {
    next(error);
  }
};


*/


































































































// @desc    تسجيل الدخول للمستخدم
// @route   POST /api/auth/login
// @access  Public

/*
exports.login = async (req, res, next) => {
  try {
    const { email, password, universityId, nationalId } = req.body;
    
    let user;
    
    // التحقق مما إذا كان تسجيل الدخول باستخدام البريد الإلكتروني ( رئيس القسم)
    if (email && password) {
      // البحث عن المستخدم عن طريق البريد الإلكتروني
      user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
      
      // التحقق مما إذا كانت كلمة المرور متطابقة
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
    } 
    // التحقق مما إذا كان تسجيل الدخول باستخدام رقم الجامعة (للطالب)
    else if (universityId && password) {
      // البحث عن الطالب عن طريق رقم الجامعة
      const student = await Student.findOne({ universityId });
      
      if (!student) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
      
      // الحصول على المستخدم المرتبط بهذا الطالب
      user = await User.findById(student.user).select('+password');
      
      if (!user) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
      
      // التحقق مما إذا كانت كلمة المرور متطابقة
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
    }
    // التحقق مما إذا كان تسجيل الدخول باستخدام الرقم الوطني (للشركة)
    else if (nationalId && password) {
      // البحث عن الشركة عن طريق الرقم الوطني
      const company = await Company.findOne({ nationalId });
      
      if (!company) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
      
      // الحصول على المستخدم المرتبط بهذه الشركة
      user = await User.findById(company.user).select('+password');
      
      if (!user) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
      
      // التحقق مما إذا كانت كلمة المرور متطابقة
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return next(new ApiError(401, 'Invalid credentials'));
      }
    } else {
      return next(new ApiError(400, 'Please provide valid credentials'));
    }
    
    // تسجيل الدخول الناجح
    logger.info(`User logged in: ${user.email} (${user.role})`);
    
    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};
*/



















//تسجيل دخول حسب شات جي بي تي 
// @desc    تسجيل الدخول للمستخدم
// @route   POST /api/auth/login
// @access  Public
/*exports.login = async (req, res, next) => {
  try {
    const { email, password, studentId, nationalId } = req.body;

    let user;

    // ✅ تسجيل الدخول كرئيس قسم (باستخدام البريد الإلكتروني)
    if (email && password) {
      user = await User.findOne({ email }).select('+password');

      if (!user) {
        return next(new ApiError(401, 'بيانات تسجيل الدخول غير صحيحة'));
      }

      // التحقق من كلمة المرور
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ApiError(401, 'بيانات تسجيل الدخول غير صحيحة'));
      }
    } 
    // ✅ تسجيل الدخول كطالب (باستخدام الرقم الجامعي)
    else if (studentId && password) {
      user = await User.findOne({ studentId }).select('+password');

      if (!user) {
        return next(new ApiError(401, 'بيانات تسجيل الدخول غير صحيحة'));
      }

      // التحقق من كلمة المرور
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ApiError(401, 'بيانات تسجيل الدخول غير صحيحة'));
      }
    } 
    // ✅ تسجيل الدخول كشركة (باستخدام الرقم الوطني)
    else if (nationalId && password) {
      user = await User.findOne({ nationalId }).select('+password');

      if (!user) {
        return next(new ApiError(401, 'بيانات تسجيل الدخول غير صحيحة'));
      }

      // التحقق من كلمة المرور
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ApiError(401, 'بيانات تسجيل الدخول غير صحيحة'));
      }
    } 
    // ❌ في حال لم يتم تقديم بيانات تسجيل صحيحة
    else {
      return next(new ApiError(400, 'يرجى إدخال بيانات تسجيل صحيحة'));
    }

    // ✅ تسجيل الدخول الناجح
    logger.info(`تم تسجيل الدخول: ${user.role} (${user._id})`);
    sendTokenResponse(user, 200, res, 'تم تسجيل الدخول بنجاح');
  } catch (error) {
    next(error);
  }
};


















*/
