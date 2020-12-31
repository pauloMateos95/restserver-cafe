const express = require('express');
const { verificaToken } = require('../middlewares/auth');
const Product = require('../models/Product');

const app = express();


app.get('/productos', verificaToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Product.find({ available: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'desc')
        .exec( (err, products) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });

        });

});

app.get('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Product.findById( id )
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec( (err, productDB) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( !productDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'Id not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
    
        })

});

app.get('/productos/buscar/:term', verificaToken, (req, res) => {

    let term = req.params.term;

    let regexp = new RegExp(term, 'i');

    Product.find({ name: regexp })
        .populate('category', 'name')
        .exec( (err, products) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });

        })

});

app.post('/productos', verificaToken, (req, res) => {

    const body = req.body;

    const product = new Product({
        user: req.user._id,
        name: body.name,
        price: body.price,
        desc: body.desc,
        category: body.category,
        available: body.available
    });

    product.save( (err, productDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });

    })

});

app.put('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Product.findById(id, (err, productDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id not found'
                }
            });
        }

        productDB.name = body.name;
        productDB.price = body.price;
        productDB.desc = body.desc;
        productDB.category = body.category;
        productDB.available = body.available;

        productDB.save( (err, productSaved) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productSaved
            });

        })

    });

});

app.delete('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Product.findById( id, (err, productDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id not found'
                }
            });
        }

        productDB.available = false;

        productDB.save( (err, productDeleted) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productDeleted,
                msg: 'Product deleted'
            });

        })

    })

});





module.exports = app;