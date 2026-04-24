const {Router} = require("express")
const router= Router();
const multer  = require('multer')
const path = require("path")
const Blog = require("../models/blog");

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
    return res.render("addBlog");
})

router.post("/",upload.single('coverImage'), async (req,res)=>{
    const { title, body } = req.body;
    const blog=await Blog.create({
        title,
        body,
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : undefined,
        createdBy: req.user?._id,
    });
    return res.redirect(`/blog/${blog._id}`);
})

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    return res.render("blog", { blog });
});

module.exports=router;
