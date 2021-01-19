const {Router} = require('express');
const {cnn_mysql} = require('../config/databases');
const router = Router();

router.post('/linea/isertar', async(req, res) => {
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

router.get('/linea/registros', (req, res) => {
    cnn_mysql.query(`SELECT * FROM tipo_linea`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            cantidad = resulset.length;
            console.log(cantidad);
            if (cantidad != 20){
                return res.jsonp(`La cantidad ${cantidad} registros no es la esperada`);
            } else {
                return res.jsonp(`La cantidad ${cantidad} registros es correcta`);
            }
        }
    })
});

router.get('/linea/lineas', (req, res) => {
    cnn_mysql.query(`SELECT desc_marca, desc_linea FROM tipo_linea INNER JOIN tipo_marca
     ON tipo_linea.id_marca = tipo_marca.id_marca ORDER BY tipo_linea.id_marca`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.get('/linea/activosInactivos', (req, res) => {
    cnn_mysql.query(`SELECT COUNT(activo) AS activo FROM tipo_linea WHERE activo = 'S' UNION
    SELECT COUNT(activo) FROM tipo_linea WHERE activo = 'N'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            const result = {
                activos: resulset[0].activo,
                inactivos: resulset[1].activo
            }
            return res.json(result)
        }
    })
});

router.get('/linea/cambiar-estado', (req, res) => {
    cnn_mysql.query(`SELECT id_linea, desc_linea, id_marca, REPLACE(activo, 'S', 'Activo') AS activo FROM tipo_linea WHERE activo = 'S' UNION
    SELECT id_linea, desc_linea, id_marca, REPLACE(activo, 'N', 'Inactivo') FROM tipo_linea WHERE activo = 'N'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset)
        }
    })
});

module.exports = router