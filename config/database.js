import mongoose from "mongoose";
import dotenv from "dotenv"

//load env variable
dotenv.config();

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("dbConnection successfully")

    }catch(err){
        console.log("Error in dbConnection",err.message);
        process.exit(1);

    }
}
export default dbConnection;

// userName=channusin280622_db_user
// password=pnH7RWt421m9aNi2
// db_url=mongodb+srv://channusin280622_db_user:pnH7RWt421m9aNi2@cluster0.g3hpkar.mongodb.net/studyNotion
// mongodb://127.0.0.1:27017/studyNotion 