



//-----------------------
// Puerto
//-----------------------
process.env.PORT = process.env.PORT || 4000;

//-----------------------
// Entorno
//-----------------------
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//-----------------------
// Vencimiento del Token
//-----------------------
process.env.CADUCIDAD_TOKEN = '5h';

//-----------------------
// SEED de autenticación
//-----------------------
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//-----------------------
// Base de datos
//-----------------------
let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//-----------------------
// Google Client ID
//-----------------------
process.env.CLIENT_ID = process.env.CLIENT_ID || '1026523086575-8psga67k45thq354bb0v336vcaeajb69.apps.googleusercontent.com';