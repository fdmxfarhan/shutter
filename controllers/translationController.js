const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify');
const fs = require('fs');

const Translation = require('./../models/translationModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne
} = require('./../controllers/handlerFactory');

const multerStorage = multer.memoryStorage();

const fileDest = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'public';
  }

  if (process.env.NODE_ENV === 'production') {
    return 'client/public';
  }
};

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not a Image Or Pdf Or Docx!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTranslationFiles = upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'pdfFiles', maxCount: 20 },
  { name: 'wordFiles', maxCount: 20 }
]);

exports.resizeTranslationFiles = catchAsync(async (req, res, next) => {
  console.log(req.files);

  if (!req.files) return next();

  req.body.slug = slugify(req.body.title, { lower: true });

  req.body.images = [];
  req.body.pdfFiles = [];
  req.body.wordFiles = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `translation-${req.body.slug}-${Date.now()}-${i +
        1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 85 })
        .toFile(`${fileDest()}/translations/img/${filename}`);

      req.body.images.push(filename);
    })
  );

  await Promise.all(
    req.files.pdfFiles.map(async (file, i) => {
      const filename = `translation-${req.body.slug}-${Date.now()}-${i +
        1}.pdf`;

      await fs.writeFile(
        `${fileDest()}/translations/pdf/${filename}`,
        file.buffer,
        err => {
          if (err) throw err;
          console.log('The file has been saved!');
        }
      );

      req.body.pdfFiles.push(filename);
    })
  );

  await Promise.all(
    req.files.wordFiles.map(async (file, i) => {
      const filename = `translation-${req.body.slug}-${Date.now()}-${i +
        1}.docx`;

      await fs.writeFile(
        `${fileDest()}/translations/word/${filename}`,
        file.buffer,
        err => {
          if (err) throw err;
          console.log('The file has been saved!');
        }
      );

      req.body.wordFiles.push(filename);
    })
  );

  next();
});

exports.getAllTranslations = getAll(Translation);
exports.getTranslation = getOne(Translation);
exports.createTranslation = createOne(Translation);
exports.deleteTranslation = deleteOne(Translation);
exports.updateTranslation = updateOne(Translation);
