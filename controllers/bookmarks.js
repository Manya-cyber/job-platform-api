const bookmarksC = require('../services/bookmarks')
//bookmarking 
async function bookmarks(req,res){
try{
    const userId= req.user.userId;
    const jobId = req.params.jobId;


    const bookmark = await bookmarksC.bookmarks(userId,jobId);
if (!bookmark) {
    return res.status(400).json({ error: 'Already bookmarked' });
}
return res.status(201).json({ message: 'Job bookmarked' });}
    catch(error){
        res.status(500).json({"error" : "Something went wrong"})
    }

}


//getting the bookmarks of the user

async function getBookmarks(req,res){
    try{
        const userId = req.user.userId;

        const allBookMarks = await bookmarksC.getBookmarks(userId);
        return res.status(200).json(allBookMarks);

    }catch(error){
        return res.status(404).json({"error": "bookmarks not found"});

    }

}


//deleting the bookmark of the user

async function delBookmarks(req,res){
    try{
        const userId =req.user.userId;
        const jobId = req.params.jobId;

const serverRes = await bookmarksC.bookmarksDel(userId, jobId);
if (!serverRes) {
    return res.status(404).json({ error: 'Bookmark not found' });
}
return res.status(200).json({ message: 'Bookmark removed' });

// catch stays as 500
}catch(error) {
    return res.status(500).json({ error: 'Something went wrong' });
}

}


module.exports= {bookmarks,getBookmarks, delBookmarks};