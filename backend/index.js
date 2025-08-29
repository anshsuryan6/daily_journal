//index.js

const UserRouter = require("./routes/user.js")
const express = require("express")
const mongo = require("mongoose");
const PostRouter = require("./routes/post.js");
const cors = require("cors")
const app = express();
app.use(cors())
const port = process.env.PORT || 8000;
app.use(express.json())

app.listen(port, () => {
    console.log(`Server live at http://localhost:${port}`)
})

app.use('/api/v1/user', UserRouter)
app.use('/api/v1/blog', PostRouter)