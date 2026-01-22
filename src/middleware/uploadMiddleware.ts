import multer, { StorageEngine } from "multer";
const storage: StorageEngine = multer.memoryStorage();
export const uploadCSV = multer({ storage });
