const express = require('express');
const app = express();

const { verificaToken, verificaAdminRole } = require('../middlewares/auth');
const Category = require('../models/Category');


app.get('/categoria', (req, res) => {

    Category.find({})
            .sort('desc')
            .populate('user', 'name email')
            .exec( (err, categories) => {

                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categories
                });

            })

});

app.get('/categoria/:id', (req, res) => {

    const id = req.params.id;

    Category.findById( id, (err, categoryDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoryDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });

});

app.post('/categoria', verificaToken, (req, res) => {

    const body = req.body;

    const category = new Category({
        desc: body.desc,
        user: req.user._id
    });

    category.save( (err, categoryDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoryDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    })

});

app.put('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    const descCategory = {
        desc: body.desc
    }

    Category.findByIdAndUpdate( id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoryDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    })

});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;

    Category.findByIdAndRemove( id, (err, categoryDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoryDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id not found'
                }
            });
        }

        res.json({
            ok: true,
            msg: 'Category deleted'
        });

    });

});




module.exports = app;