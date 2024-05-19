const userController = require('../controllers/userContoller');
const express = require('express');
const {updateAuth,registerAuth,loginAuth} = require('../middleware/userMiddelware')
const router = express.Router();

router.post('/createUser',registerAuth,userController.createUser);
router.patch('/updateUser',updateAuth,userController.updateUserProfile);

router.post('/loginUser',loginAuth,userController.loginUser);
router.delete('/logoutUser',userController.logoutUser);



module.exports = router;