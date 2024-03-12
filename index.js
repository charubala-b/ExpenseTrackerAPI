const mongoose= require('mongoose')
const express = require('express')
const {Expense} = require('./schema.js')
const bodyparser=require('body-parser')
const cors = require('cors')

const app=express()
app.use(bodyparser.json())
app.use(cors())
async function connectTodb(){
    try{
        await mongoose.connect('mongodb+srv://charubalab:Charu2004@cluster0.tktmk2c.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
        console.log("db connection established");
        const port=process.env.PORT || 8000
        app.listen(port,function(){
         console.log(`listening on ${port}....`)
        })
    }
    catch(error){
        console.log(error);
        console.log("couldn't connect to db connection");
    }
}
connectTodb();

app.post('/add-expense',async function(request,response){
    try{
    await Expense.create({
        "amount" : request.body.amount,
        "category" : request.body.category,
        "date" : request.body.date
       });
       response.status(200).json({
        "status":"inserted sucessfully"
       });
    }
    catch(error){
        response.status(401).json({
            "error-occurrence":error,
            "status":"not inserted sucessfully"
        });
    }
})

app.get('/get-expense',async function(request,response){
    try{
    const expensedetail=await Expense.find();
    response.status(200).json({
        "total":expensedetail
    })
    }
    catch(error){
        response.status(500).json({
            "status":"not sucessfully recieved",
            "error":error
        });
    }
})

app.delete('/delete-expense/:id',async function(request,response){
    try{
        const expenseEntry=await Expense.findById(request.params.id);
        if(expenseEntry){
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status":"deleted sucessfully"
            })
        }
        else{
            response.status(401).json({
                "status":"data not found"
            });
        }
    }
    catch(error){
        response.status(404).json(error);
    }
})

app.patch('/update-expense/:id',async function(request,response){
    try{
        const expenseEntry=await Expense.findById(request.params.id);
        if(expenseEntry){
            await expenseEntry.updateOne({
                "amount":request.body.amount,
                "category":request.body.category,
                "date":request.body.date
            })
            response.status(200).json({
                "status":"updated sucessfully"
            })
        }
        else{
            response.status(401).json({
                "status":"data not found"
            });
        }
    }
    catch(error){
        response.status(404).json(error);
    }
})

/*
*Expense Tracker

*adding a new expense = "/add-expense"
post : expences user entries

*dispaying existing records = "/get-expense"
get : display entries

*delete an expense = "/delete-expense"
post : entry id

*updating an expense = "/update-expense"
post : both id and entry data
*/

