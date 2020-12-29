const jwt = require('jsonwebtoken');


//---------------------
// Verificar Token
//---------------------
const verificaToken = ( req, res, next ) => {

    const token = req.get('x-token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;

        next();

    });

};

//--------------------
// Verifica AdminRole
//--------------------
const verificaAdminRole = ( req, res, next ) => {

    const { role } = req.user;
    
    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            ok: false,
            err: {
                msg: 'Only admin can make changes'
            }
        });
    }

    next();

}



module.exports = {
    verificaToken,
    verificaAdminRole
}
