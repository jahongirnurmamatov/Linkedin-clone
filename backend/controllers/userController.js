import User from "../models/User.js";

export const getSugestedConnection = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("-password");
    // find users who are not already connected and do not reccommend our own profile
    const suggestedUsers = await User.find({
      _id: { $nin: [...currentUser.connections, currentUser._id] },
    })
      .select("name username profilePicture headline")
      .limit(3);
      res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error); 
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getPublicProfile=async(req,res)=>{
    try {
        const user = await User.findOne({username:req.params.username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error); 
        res.status(500).json({ error: "Internal server error!" });
    }
}