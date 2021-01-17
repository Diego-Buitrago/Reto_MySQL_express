const {Router} = require('express');
const {cnn_mysql} = require('./../config/databases');
const router = Router();

router.post('/vehiculos', async(req, res) => {
    try {
        const {
            nro_placa,
            id_linea,
            modelo,
            fecha_ven_seguro,
            fecha_ven_tecnomecanica,
            fecha_ven_contratodo
        } = req.body
        const [rows, fields] = await cnn_mysql.promise().execute(`INSERT INTO vehiculos(nro_placa, id_linea, modelo, fecha_ven_seguro,
            fecha_ven_tecnomecanica, fecha_ven_contratodo) VALUES(?, ?, ?, ?, ?, ?)`, [nro_placa, id_linea, modelo, fecha_ven_seguro,
            fecha_ven_tecnomecanica, fecha_ven_contratodo]);

        if (rows.affectedRows > 0) {
            res.json({
                nro_placa: nro_placa,
                id_linea: id_linea,
                modelo: modelo,
                fecha_ven_seguro: fecha_ven_seguro,
                fecha_ven_tecnomecanica: fecha_ven_tecnomecanica,
                fecha_ven_contratodo: fecha_ven_contratodo
            })
        } else {
            res.json({});
        }
    } catch (e) {
        res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
    }
});

module.exports = router