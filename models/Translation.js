const mongoose = require('mongoose');
const { bool } = require('sharp');

const languagesFa = ['فارسی', 'انگلیسی (طلائی)', 'انگلیسی (نقره ای)', 'انگلیسی (برنزی)', 'عربی', 'ترکی', 'استانبولی', 'روسی', 'چینی', 'هندی', 'اردو', 'آلمانی', 'فرانسوی', 'کوردی'];
const destLanguagesFa = ['فارسی', 'انگلیسی', 'عربی', 'ترکی', 'استانبولی', 'روسی', 'چینی', 'هندی', 'اردو', 'آلمانی', 'فرانسوی', 'کوردی'];

const translationSchema = new mongoose.Schema({
  title: String,
  username: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    require: true
  },
  baseLanguage: {
    type: String,
    required: true,
    enum: {
      values: languagesFa
    }
  },
  destLanguage: {
    type: String,
    required: true,
    enum: {
      values: destLanguagesFa
    }
  },
  numberOfPages: Number,
  numberOfWords: Number,
  file: String,
  text: String,
  time: String,
  price: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    required: true,
    default: 'در حال بررسی',
    enum: ['در حال بررسی', 'در حال ترجمه', 'ترجمه شده', 'در انتظار مترجم']
  },
  translator: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  description: String,
  done: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  translatedFile: String,
  translatedText: String,
  paymentId: String,
  payed:{
    type: Boolean,
    default: false
  },
  code: String
});

// translationSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'translators',
//     select: '-__v -passwordChangedAt'
//   });

//   next();
// });

// translationSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;


