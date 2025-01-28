import express from "express"
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controller/post.controller.js";
import { verifyToken } from "../middleware/verifytoken.js";


const router= express.Router()


router.get("/",getPosts)
router.get("/:id",getPost);
router.post("/",verifyToken,addPost);
router.put("/:id",verifyToken,updatePost);
router.delete("/:id",verifyToken,deletePost);



export default router