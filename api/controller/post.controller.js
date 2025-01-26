import prisma from "../lib/prisma";

export const getPosts = async (req, res) => {
try{
    const posts=await prisma.post.findMany()

res.status(200).json({message:"Posts fetched successfully",posts})

}
catch(err){ 
    console.log(err)
    res.status(500).json({message:"Failed to get posts"})
}
}


export const getPost = async (req, res) => {
    const id = req.params.id;
    try{
        const post=await prisma.post.findUnique({
            where:{
                id:Number(req.params.id)
            }
        })

    
    res.status(200).json({message:"Post fetched successfully",post})
    
    }
    catch(err){ 
        console.log(err)
        res.status(500).json({message:"Failed to get post"})
    }
    }

    export const addPost = async (req, res) => {
        const body = req.body;
        const tokenUserId = req.userId;
        try{
            const post=await prisma.post.create({
                data:{
                    title:req.body.title,
                    desc:req.body.desc,
                    photo:req.body.photo,
                    userId:req.userId
                }
            })
        
        res.status(200).json({message:"Posts added successfully",post})
        
        }
        catch(err){ 
            console.log(err)
            res.status(500).json({message:"Failed to add post"})
        }
        }


        export const updatePost = async (req, res) => {
            try{
            
            res.status(200).json({message:"Posts updated successfully"})
            
            }
            catch(err){ 
                console.log(err)
                res.status(500).json({message:"Failed to update post"})
            }
            }

            export const deletePost = async (req, res) => {
                try{
                
                res.status(200).json({message:"Posts deleted successfully"})
                
                }
                catch(err){ 
                    console.log(err)
                    res.status(500).json({message:"Failed to delete post"})
                }
                }