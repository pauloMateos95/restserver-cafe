const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');


const app = express();
app.use(fileUpload());



app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'No files were uploaded'
            }
        });
    }

    // Validar tipo
    let validTypes = ['products', 'users'];

    if( validTypes.indexOf( type ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Invalid type'
            }
        })
    }


    let file = req.files.file;
    let splitFileName = file.name.split('.');
    let extension = splitFileName[splitFileName.length - 1];


    // Extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if( validExtensions.indexOf( extension ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Invalid extension'
            }
        })
    }

    // Cambiar nombre al archivo
    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`



    file.mv(`uploads/${ type }/${ fileName }`, (err) => {

        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( type === 'users' ) {

            userImage(id, res, fileName);

        }

        if( type === 'products' ) {

            productImage(id, res, fileName);

        }

      });

});



function userImage(id, res, fileName) {

    User.findById( id, (err, userDB) => {

        if( err ) {
            deleteFile( fileName, 'users' );
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !userDB ) {
            deleteFile( fileName, 'users' );
            return res.status(500).json({
                ok: false,
                err: {
                    msg: 'User does not exist'
                }
            });
        }

        // Borrar imagen si ya existe en el path
        deleteFile( userDB.img, 'users' );


        userDB.img = fileName;

        userDB.save( (err, userSaved) => {

            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });

        })

    })

}

function productImage(id, res, fileName) {

    Product.findById( id, (err, productDB) => {

        if( err ) {
            deleteFile( fileName, 'products' );
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productDB ) {
            deleteFile( fileName, 'products' );
            return res.status(500).json({
                ok: false,
                err: {
                    msg: 'Product does not exist'
                }
            });
        }

        // Borrar imagen si ya existe en el path
        deleteFile( productDB.img, 'products' );


        productDB.img = fileName;

        productDB.save( (err, productSaved) => {

            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            });

        })

    })

}

function deleteFile( imgName, type ) {

    let pathUrl = path.resolve(__dirname, `../../uploads/${ type }/${ imgName }`);
        if( fs.existsSync(pathUrl) ){
            fs.unlinkSync(pathUrl);
        }

}


module.exports = app;