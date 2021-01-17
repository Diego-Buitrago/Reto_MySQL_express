const {Router} = require('express');
const {cnn_mysql} = require('../config/databases');
const router = Router();

router.post('/marca', async(req, res) => {
    try {
        const {
            desc_marca,
            activo
        } = req.body
        const [rows, fields] = await cnn_mysql.promise().execute(`INSERT INTO tipo_marca(desc_marca, activo) VALUES(?, ?)`, [desc_marca, activo]);

        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                desc_marca: desc_marca,
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