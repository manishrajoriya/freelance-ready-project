import mongoose from "mongoose";



type CoonectionObject = {
    isConnected? : number
}


const connection : CoonectionObject = {}

 async function connectDB(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected db");
        return
    }

    try {
       const db = await mongoose.connect(process.env.MONGODB_URL || "", {})

       connection.isConnected= db.connections[0].readyState

       console.log("db connected ");
       
    } catch (error) {
        console.log("db connection failed ", error);
        
        process.exit(1)
    }

}

export default connectDB;