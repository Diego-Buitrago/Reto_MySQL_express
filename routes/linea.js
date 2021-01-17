const {Router} = require('express');
const {cnn_mysql} = require('../config/databases');
const router = Router();

router.post('/linea', async(req, res) => {
    try {
        const {
            desc_linea,
            id_marca,
            activo
        } = req.body
        const [rows, fields] = await cnn_mysql.promise().execute(`INSERT INTO tipo_linea(desc_linea, id_marca, activo) VALUES(?, ?, ?)`, [desc_linea, id_marca, activo]);

        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                desc_linea: desc_linea,
                id_marca: id_marca,
                activo: activo
            })
        } else {
            res.json({});
        }
    } catch (e) {
        res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
    }
});

module.exports = router