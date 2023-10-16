// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

const chatSchema = new mongoose.Schema({

});
// added crerate & update time in document
chatSchema.plugin(timeStamp);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;