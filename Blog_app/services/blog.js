const {Router} = require("express")
const router= Router();
const multer  = require('multer')
const path = require("path")
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const Comment = require('../models/comments');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName=`${Date.now()}-${file.originalname}`
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    return res.render("addBlog");
})


router.post("/",upload.single('coverImage'), async (req,res)=>{
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    const { title, body } = req.body;
    if (!title?.trim() || !body?.trim()) {
        return res.redirect("/blog/add-new");
    }
    const blog=await Blog.create({
        title: title.trim(),
        body: body.trim(),
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : undefined,
        createdBy: req.user?._id,
    });
    return res.redirect(`/blog/${blog._id}`);
})

router.get("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send("Blog not found");
    }
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({blogId:req.params.id}).populate("createdBy");
    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    return res.render("blog", { 
        user:req.user,
        blog,
        comments
     });
});

// comment
router.post('/comment/:blogId',async (req,res)=>{
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.blogId)) {
        return res.status(404).send("Blog not found");
    }
    const content = req.body.content?.trim();
    if (!content) {
        return res.redirect(`/blog/${req.params.blogId}`);
    }
    await Comment.create({
        content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})
module.exports=router;
