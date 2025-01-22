const caseRouter = require('express').Router()
const caseController = require('../controllers/caseController');
const upload = require('../config/multerConfig');  // นำเข้า upload จาก multerConfig
const authenticateToken = require('../middleware/auth');

// ใช้ multer ในการอัปโหลดไฟล์
caseRouter.post('/', upload.array('images', 5), caseController.createCase);

caseRouter.get('/info',authenticateToken, caseController.getCaseInfo)
caseRouter.get('/', caseController.listCase)
caseRouter.get('/:id', caseController.getCaseById)
caseRouter.get('/search/status', caseController.searchCaseStatus)

caseRouter.put('/:id', upload.array('images', 5), caseController.updateCase)

caseRouter.delete('/:id', caseController.deleteCase)

module.exports = caseRouter;
