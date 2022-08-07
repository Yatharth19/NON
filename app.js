const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect('mongodb://localhost:27017/Sample',{useNewUrlParser:true, useUnifiedTopology:true}).then(() =>{
    console.log('connected with mongodb');
}).catch((err) => {
    console.log(err);
})

app.use(express.json());
const productSchema = new mongoose.Schema({//A Mongoose schema defines the structure of the document, default values, validators, etc., like pydantic model 
    name: String,
    description: String,
    price: Number,
})

const Product = new mongoose.model("Product", productSchema);



app.post('/api/v1/product/new', async(req,res) => {//async used because, we used await in the next line.
    const product = await Product.create(req.body)    //req.body used here because, we will send data from the frontend. await used because we don't want the execution to continue until it is fulfilled
    // console.log(product)
    res.status(200).json({
        success: true,
        product
    })
});


//To get all products

app.get('/api/v1/products', async(req, res) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

});


//To update product

app.put('/api/v1/update/:id', async(req, res) => {
    
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true,
    useFindAndModify: true,
    runValidators: true});
        console.log(product)
    res.status(200).json({
        success: true,
        product
    });

});

app.delete('/api/v1/delete/:id', async(req, res) => {

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false
        })
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })

});




app.listen(4500, () => {
    console.log("Server is running http://localhost:4500");
});