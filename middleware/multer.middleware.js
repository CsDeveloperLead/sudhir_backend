import multer from 'multer'

const DIR = "./public/temp/"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
})