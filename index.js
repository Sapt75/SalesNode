const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//Connencting to the database Mongo DB Atlas
mongoose.connect('mongodb://localhost:27017')

//Defining the Schema
const itemSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: String,
    category: String,
    sold: Boolean,
    date: String
})

//Setting the model
const Item = mongoose.model('Item', itemSchema)



app.get('/', async (req, res) => {
    //Fetching data from the third party api and loading it into the database 
    let data = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    let response = await data.json()
    for (i = 0; i < response.length; i++) {
        let date = new Date(response[i].dateOfSale)
        var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;
        var longName = monthName(date);
        const item = new Item({
            id: response[i].id,
            title: response[i].title,
            price: response[i].price,
            category: response[i].category,
            sold: response[i].sold,
            date: longName
        })
        item.save((err) => {
            if (err) {
                console.log(err)
            }
        })
    }
    res.send("Data Saved")
})

//To get data http://localhost:3000/data/month 
app.get('/data/:month', (req, res) => {
    let totalSales = 0
    let totalItemsSold = 0
    let totalItemsUnsold = 0


    //Converting the first Letter to Uppercase, so there's no error if user inputs month in lower case
    let month = req.params.month.charAt(0).toUpperCase() + req.params.month.slice(1);

    //Fetching the data from the database and looping through it to set the total sales,quantity of item sold and unsold
    Item.find((err, result) => {
        if (err) {
            console.log(err)
        } else {
            result.map((item) => {
                if (item.date == month) {
                    if (item.sold == true) {
                        totalSales = totalSales + parseFloat(item.price)
                        totalItemsSold = totalItemsSold + 1
                    } else {
                        totalItemsUnsold = totalItemsUnsold + 1
                    }
                }
            })
            res.send({
                Sales: totalSales + " Rs",
                Sold: totalItemsSold,
                Unsold: totalItemsUnsold
            })
        }
    })
})

//To get data http://localhost:3000/barchart/month 
app.get('/barchart/:month', (req, res) => {

    //Converting the first Letter to Uppercase, so there's no error if user inputs month in lower case
    let month = req.params.month.charAt(0).toUpperCase() + req.params.month.slice(1);

    //Creating an object to increment the values of the sold/unsold items for each price range
    let data = {
        "0-100": {
            sold: 0,
            unsold: 0
        },
        "101-200": {
            sold: 0,
            unsold: 0
        },
        "201-300": {
            sold: 0,
            unsold: 0
        },
        "301-400": {
            sold: 0,
            unsold: 0
        },
        "401-500": {
            sold: 0,
            unsold: 0
        },
        "501-600": {
            sold: 0,
            unsold: 0
        },
        "601-700": {
            sold: 0,
            unsold: 0
        },
        "701-800": {
            sold: 0,
            unsold: 0
        },
        "801-900": {
            sold: 0,
            unsold: 0
        },
        "901-above": {
            sold: 0,
            unsold: 0
        },

    }


    //Fetching data from database and looping through the data and setting the quantity for each price range
    Item.find((err, result) => {
        if (err) {
            console.log(err)
        } else {
            result.map((item) => {
                //Checking if the conditions are met and then incrementing the values of the sold/unsold items in the price range
                if (item.date == month) {
                    if (item.price >= 0 && item.price <= 100) {
                        if (item.sold == true) {
                            data['0-100'].sold = data['0-100'].sold + 1
                        } else {
                            data['0-100'].unsold = data['0-100'].unsold + 1
                        }
                    } else if (item.price >= 101 && item.price <= 200) {
                        if (item.sold == true) {
                            data['101-200'].sold = data['101-200'].sold + 1
                        } else {
                            data['101-200'].unsold = data['101-200'].unsold + 1
                        }
                    } else if (item.price >= 201 && item.price <= 300) {
                        if (item.sold == true) {
                            data['201-300'].sold = data['201-300'].sold + 1
                        } else {
                            data['201-300'].unsold = data['201-300'].unsold + 1
                        }
                    } else if (item.price >= 301 && item.price <= 400) {
                        if (item.sold == true) {
                            data['301-400'].sold = data['301-400'].sold + 1
                        } else {
                            data['301-400'].unsold = data['301-400'].unsold + 1
                        }
                    } else if (item.price >= 401 && item.price <= 500) {
                        if (item.sold == true) {
                            data['401-500'].sold = data['401-500'].sold + 1
                        } else {
                            data['401-500'].unsold = data['401-500'].unsold + 1
                        }
                    } else if (item.price >= 501 && item.price <= 600) {
                        if (item.sold == true) {
                            data['501-600'].sold = data['501-600'].sold + 1
                        } else {
                            data['501-600'].unsold = data['501-600'].unsold + 1
                        }
                    } else if (item.price >= 601 && item.price <= 700) {
                        if (item.sold == true) {
                            data['601-700'].sold = data['601-700'].sold + 1
                        } else {
                            data['601-700'].unsold = data['601-700'].unsold + 1
                        }
                    } else if (item.price >= 701 && item.price <= 800) {
                        if (item.sold == true) {
                            data['701-800'].sold = data['701-800'].sold + 1
                        } else {
                            data['701-800'].unsold = data['701-800'].unsold + 1
                        }
                    } else if (item.price >= 801 && item.price <= 900) {
                        if (item.sold == true) {
                            data['801-900'].sold = data['801-900'].sold + 1
                        } else {
                            data['801-900'].unsold = data['801-900'].unsold + 1
                        }
                    } else if (item.price >= 901) {
                        if (item.sold == true) {
                            data['901-above'].sold = data['901-above'].sold + 1
                        } else {
                            data['901-above'].unsold = data['901-above'].unsold + 1
                        }
                    }
                }

            })

            //Flitering the price range that has sold/unsold items in it with the help of keys and values 
            data = Object.values(data).filter(values => {
                if (values.sold || values.unsold != 0) {
                    return values
                }
            }).map((item) => Object.keys(data).find(key => data[key] == item)).reduce((obj, key) => {
                obj[key] = data[key]
                return obj
            }, {})

            res.send(data)
        }
    })
})

//To get data http://localhost:3000/piechart/month 
app.get('/piechart/:month', (req, res) => {

    //Converting the first Letter to Uppercase, so there's no error if user inputs month in lower case
    let month = req.params.month.charAt(0).toUpperCase() + req.params.month.slice(1);

    //Creating an object to increment the values of the sold/unsold items for each category
    let data = {
        "men's clothing": {
            sold: 0,
            unsold: 0
        },
        "jewelery": {
            sold: 0,
            unsold: 0
        },
        "electronics": {
            sold: 0,
            unsold: 0
        },
        "women's clothing": {
            sold: 0,
            unsold: 0
        }
    }

    //Fetching data from database and looping through the data and setting the quantity for each category
    Item.find((err, result) => {
        if (err) {
            console.log(err)
        } else {
            //Checking if the conditions are met and then incrementing the values of the sold/unsold items in each category
            result.map((item) => {
                if (item.date == month) {
                    if (item.sold == true) {
                        data[item.category].sold = data[item.category].sold + 1
                    } else {
                        data[item.category].unsold = data[item.category].unsold + 1
                    }
                }
            })
        }


        //Flitering the category that has sold/unsold items in it with the help of keys and values 
        data = Object.values(data).filter(values => {
            if (values.sold || values.unsold != 0) {
                return values
            }
        }).map((item) => Object.keys(data).find(key => data[key] == item)).reduce((obj, key) => {
            obj[key] = data[key]
            return obj
        }, {})

        res.send(data)
    })
})

//To get data http://localhost:3000/alldata/month 
app.get('/alldata/:month', async (req, res) => {

    //Converting the first Letter to Uppercase, so there's no error if user inputs month in lower case
    let month = req.params.month.charAt(0).toUpperCase() + req.params.month.slice(1);

    //Fetching data from all teh api's and merging it together in a json
    let alldata = {
        data: await fetch(`http://localhost:3000/data/${month}`).then((response) => response.json()),
        BarChart: await fetch(`http://localhost:3000/barchart/${month}`).then((response) => response.json()),
        PieChart: await fetch(`http://localhost:3000/piechart/${month}`).then((response) => response.json())
    }

    res.send(alldata)

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})