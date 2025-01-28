const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send('portfolio server running')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
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
            const contactInfo = req.body;
            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth: {
                    user: 'jonydascse@gmail.com',
                    pass: 'ivqa zsgm acjg abje',
                },
            });
            const info = await transporter.sendMail({
                from: '"jony das" <jonydascse@gmail.com>', // Sender address
                to: "jonydascse@gmail.com", // list of receivers
                subject: "Portfolio Response ✔", // Subject line
                html: `
                <b>sender name: ${contactInfo?.name}</b><br/>
                <b>sender email: ${contactInfo?.email}</b><br/>
                <i>sender message: ${contactInfo?.message}</i><br/>
                `, // html body
            });
            if(info.messageId){
                res.send({success:true})
            }
        })


    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('portfolio server running on ', port)
})