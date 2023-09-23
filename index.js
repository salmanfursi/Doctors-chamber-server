const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 4000
app.use(cors())
app.use(express.json())
const user = process.env.DB_USER
const pass = process.env.DB_PASS




const uri = `mongodb+srv://${user}:${pass}@cluster1.8k16j71.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const database = client.db("doctorsDB").collection("services");
      const appoinments = client.db("doctorsDB").collection("appoinment");

      app.get('/services', async (req, res) => {
         const result = await database.find().toArray();
         res.json(result);
      });

      app.post('/appoinment', async (req, res) => {
         const body = req.body;
         const result = await appoinments.insertOne(body);
         res.send(result)
         console.log(result);
      });

      app.get('/appoinment', async (req, res) => {
         let query = {}
         if (req.query?.email) {
            query = { email: req.query.email }
         }
         const result = await appoinments.find(query).toArray();
         res.send(result)

      });
      app.get('/appoinment/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: new ObjectId(id) }
         const result = await appoinments.find(query).toArray();
         res.send(result)

      });

      app.delete('/appoinment/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: new ObjectId(id) }
         const result = await appoinments.deleteOne(query);
         res.send(result)
      });

      app.patch('/appoinment/:id', async (req, res) => {
         const id =req.params.id
         const payStatus =req.body
        
         let filter = {_id:new ObjectId(id)}
         const updateDoc = {
            $set: {
              status:payStatus.status
            },
          };
         const result = await appoinments.updateOne(filter, updateDoc);
         res.send(result)
         console.log(payStatus);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
   }
}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('Doctor chamber running !')
})

app.listen(port, () => {
   console.log(`Doctor chamber running  on port ${port}`)
})