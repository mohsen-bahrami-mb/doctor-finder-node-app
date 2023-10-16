// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

const commentSchema = new mongoose.Schema({

});
// added crerate & update time in document
commentSchema.plugin(timeStamp);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;