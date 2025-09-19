import mongoose from "mongoose"
import config from "./server-config.js"
const connect = async() => {
    try {
        (await mongoose.connect(config.MONGODB_URL));
    } catch (error) {
        console.log("mongodb not connected");
        throw error;
    }
}

export default connect;