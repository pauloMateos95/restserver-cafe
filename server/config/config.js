



//------------------
// Puerto
//------------------
process.env.PORT = process.env.PORT || 4000;

//------------------
// Entorno
//------------------
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//------------------
// Base de datos
//------------------
let urlDB;

// if( process.env.NODE_ENV === 'dev' ) {
//     urlDB = 'mongodb://localhost:27017/cafe';
// } else {
    urlDB = 'mongodb+srv://paulo:P7121995p@cluster0.wwwsc.mongodb.net/';
// }
process.env.URLDB = urlDB;