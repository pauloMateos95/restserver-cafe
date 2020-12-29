const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/User');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

const app = express();


app.get('/usuario', verificaToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ state: true }, 'name email role state google img')
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {

            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, counter) => {

                res.json({
                    ok: true,
                    users,
                    counter
                });

            });

        });

});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    user.save( (err, userDB) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'state'] );

    User.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let stateChange = {
        state: false
    }

    // User.findByIdAndRemove(id, (err, userDeleted) => {
    User.findByIdAndUpdate(id, stateChange, { new: true }, (err, userDeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !userDeleted ) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        });

    });

});


module.exports = app;