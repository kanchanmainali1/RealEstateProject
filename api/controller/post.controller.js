import prisma from "../lib/prisma.js";

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
            },
            include:{
                postDetail: true,
                user: {
                    select:{
                        username:true,
                        avatar:true
                    }

                },
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
            const newpost=await prisma.post.create({
                data:{
                   ...body.postData,
                   userId: tokenUserId,
                   postDetail:{
                    create: body.postDetail,

                   }
                }
            })
        
        res.status(200).json({message:"Posts added successfully",newpost})
        
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
                const id =req.params.id
                const tokenUserId=req.userId
                try{
                    const post=await prisma.post.findUnique({
                      where:{
                        id:Number(req.params.id)
                    }
                    })

                    if(post.userId!=tokenUserId){
                        return res.status(403).json({message:"Not Authorized"})
                    }
                    await prisma.post.delete({
                        where:{id:Number(req.params.id)}
                    })
                
                res.status(200).json({message:"Posts deleted successfully"})
                
                }
                catch(err){ 
                    console.log(err)
                    res.status(500).json({message:"Failed to delete post"})
                }
                }