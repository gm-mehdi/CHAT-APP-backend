import User from "../models/user.model";

export const getUsersForSidebar = async (req :any, res :any) => {
    try {
        const loggedInUserId = req.user._id;

        //find every user in the database except the one that is logged in
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(allUsers);
        
    } catch (error : any) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}