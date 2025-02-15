import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import recommendationRoutes from "./routes/recommendation.route.js"
import adminRoutes from "./routes/admin.route.js"
import adminAuthRouter from "./routes/adminauth.route.js";

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use('/api/recommendations', recommendationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/auth", adminAuthRouter);



app.listen(8800, () => {
  console.log("Server is running!");
});