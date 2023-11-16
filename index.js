 const express = require('express');
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const cors = require('cors');
 require('dotenv').config();
 const app = express();
 const port = process.env.PORT || 5000;

//  middleware 
app.use(cors());
app.use(express.json());

// mongodb url 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyaaup2.mongodb.net/?retryWrites=true&w=majority`;

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
    
    const menuCollection = client.db('bistroDB').collection('menu');
    const reviewCollection = client.db('bistroDB').collection('reviews');
    const cartCollection = client.db('bistroDB').collection('carts');

    app.get('/menu', async(req,res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    app.get('/reviews', async(req,res)=>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })
    // cart data post 
    app.post('/carts', async(req,res)=>{
      const cartData = req.body;
      const result = await cartCollection.insertOne(cartData);
      res.send(result);
    })
    // cart data get start 
    app.get('/carts', async(req,res)=>{
      const email = req.query.email;
      const query = {email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })
    // delete carts data 
    app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={ _id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async(req,res)=>{
    res.send({message:"Welcome to our server"});
})
app.listen(port, ()=>{
    console.log(`bistro boss is running soon on port : ${port}`);
})