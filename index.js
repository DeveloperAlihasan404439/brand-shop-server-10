const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
// Express middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;
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
    // Send a ping to confirm a successful connection
    const webtechCollection = client.db('Brand-Shop').collection('Brands')
    const addProductCollection = client.db('Brand-Shop').collection('product')
    const myCratCollection = client.db('Brand-Shop').collection('my_crat')

    app.get('/brands', async(req, res)=>{
      const brands = webtechCollection.find()
      const result = await brands.toArray()
      res.send(result)
    })
    app.post('/brands', async(req, res)=>{
      const brands = req.body;
      const result = await webtechCollection.insertOne(brands)
      res.send(result)
    })

    // addProductCollection start 

    app.get('/products/:brand', async(req, res)=>{
      const brand = req.params.brand;
      const filter = {brand_name: brand}
      const products = addProductCollection.find(filter)
      const result = await products.toArray()
      res.send(result)
    })

    app.get('/products', async(req, res)=>{
      const productAll = addProductCollection.find()
      const result = await productAll.toArray()
      res.send(result)
    })
    app.put('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const product = req.body;
     const updatedProduct = {
        $set:{
          name: product.name,
          image: product.image,
          brand_name: product.brand_name,
          type: product.type,
          price: product.price,
          rating: product.rating,
          description: product.description,
        }
      }
      const resutl = await addProductCollection.updateOne(query, updatedProduct)
      console.log(resutl);
      res.send(resutl)
    })
    app.post('/products', async(req, res)=>{
      const products = req.body;
      const result = await addProductCollection.insertOne(products)
      res.send(result)
    })
    app.get('/myCrat', async(req, res)=>{
      const myProducts = myCratCollection.find()
      const result = await myProducts.toArray()
      res.send(result)
    })
    // My Crat Collection 
    app.delete('/myCrat/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: id}
      const result = await myCratCollection.deleteOne(query)
      console.log(result);
      res.send(result)
    })
    app.post('/myCrat', async(req, res)=>{
      const myCrat = req.body;
      const result = await myCratCollection.insertOne(myCrat)
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('server site run the browser')
})
app.listen(port, ()=>{
    console.log(`run the server port ${port}`);
})