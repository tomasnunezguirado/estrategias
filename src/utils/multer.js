import path from 'path';
import multer from 'multer';
import __dirname from "./utils.js"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `./public/uploads`));
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const uploader = multer({
    storage,
    onError: (err, next) => {
        console.log('error', err);
        next(err);
    }
});

export default uploader;