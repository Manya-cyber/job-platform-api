const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/auth')

const bookmarksController = require('../controllers/bookmarks');

router.post('/:jobId',authmiddleware,bookmarksController.bookmarks )
//get
router.get('/',authmiddleware,bookmarksController.getBookmarks)




//delete
router.delete('/:jobId',authmiddleware,bookmarksController.delBookmarks)
module.exports=router;
