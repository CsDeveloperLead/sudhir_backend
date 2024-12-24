import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use __dirname to construct the path to the 'temp' folder
        cb(null, path.join(__dirname, 'public', 'temp'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const upload = multer({
    storage
});
