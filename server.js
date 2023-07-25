const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const errorHandler = require('./middleware/errorHandler');
const contactRouter = require("./routes/contactRoute");
const connectDB = require("./configs/dbConnection");
const userRouter = require('./routes/userRoute');

connectDB();
app.use(express.json());
app.use('/api/contacts', contactRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);


app.listen (port, () => {
    console.log(`Server started on ${port}`);
})