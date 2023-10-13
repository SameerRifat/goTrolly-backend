// multerMiddleware.mjs

// import multer from 'multer';
// import moment from 'moment';
import multer from "multer";
import moment from ''

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const originalname = file.originalname;
    const extension = originalname.slice(((originalname.lastIndexOf(".") - 1) >>> 0) + 2);
    const newFilename = `${timestamp}.${extension}`;
    cb(null, newFilename);
  },
});

export const upload = multer({ storage });

// export default function uploadSingleFile(fieldName) {
//   return upload.single(fieldName);
// }
// export const uploadSingleFile = (fieldName) => {
//   return upload.single(fieldName);
// }
