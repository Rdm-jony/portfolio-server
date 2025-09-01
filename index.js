const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(express.json())
app.use(cors({
    origin: ['https://portfolio-c81f1.web.app', "http://localhost:5173"]
}))

app.get("/", (req, res) => {
    res.send('portfolio server running')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { sendMail } = require('./utils/sendMail');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbsccmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
    }
});

async function run() {
    const projectCollcetion = client.db('portfolio').collection('projectCollection')
    const blogCollection = client.db('portfolio').collection('blogCollection')
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get("/projects", async (req, res) => {
            try {
                const result = await projectCollcetion.find().toArray()
                res.send(result)
            } catch (error) {
                console.log(error)
            }
        })

        app.get("/project/:id", async (req, res) => {
            const projectId = req.params.id;
            const result = await projectCollcetion.findOne({ _id: new ObjectId(projectId) })
            res.send(result)
        })



        app.post('/contact', async (req, res) => {
            try {
                const { email, name, message } = req.body
                await sendMail({
                    subject: "Portfolio review message",
                    templateData: {
                        name,
                        email,
                        message,
                        submittedAt: Date.now()
                    },
                    templateName: "contact"
                })

                res.send({ success: true })

            } catch (error) {
                res.send({ success: false })
            }
        })


        app.post("/blog", async (req, res) => {
            try {
                const newBlog = await blogCollcetion.insertOne(req.body);
                res.status(201).json({ data: newBlog, sucess: true });
            } catch (error) {
                res.status(400).json({ message: "Error creating blog", error, success: false });
            }
        });
        app.get("/blog/all", async (req, res) => {
            try {
                const blog = await blogCollection.find().toArray();
                res.status(201).json({ data: blog, sucess: true });
            } catch (error) {
                res.status(400).json({ message: "Error retrieving blog", error, success: false });
            }
        });
        app.get("/blog/:id", async (req, res) => {
            try {
                console.log(req.params.id)
                const blog = await blogCollection.findOne({
                    title: { $regex: `^${req.params.id}$`, $options: "i" }
                });
                res.status(201).json(blog);
            } catch (error) {
                res.status(400).json({ message: "Error retrieving blog", error, success: false });
            }
        });
    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('portfolio server running on ', port)
})