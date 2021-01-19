const {Router} = require('express');
const {cnn_mysql} = require('../config/databases');
const router = Router();

router.post('/marca/insertar', async(req, res) => {
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

router.get('/marca/registros', (req, res) => {
    cnn_mysql.query(`SELECT * FROM tipo_marca`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            cantidad = resulset.length;
            console.log(cantidad);
            if (cantidad != 5){
                return res.jsonp(`La cantidad ${cantidad} registros no es la esperada`);
            } else {
                return res.jsonp(`La cantidad ${cantidad} registros es correcta`);
            }
        }
    })
});

router.post('/marca/insertar_registro_nuevo', async(req, res) => {
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

router.put('/marca/actualizar_registro', (req, res) => {
    const id = req.query.id;
    const estado = req.query.estado;

    cnn_mysql.query(`UPDATE tipo_marca SET activo = '${estado}' WHERE id_marca = ${id}`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.send(`actualizacion de estado exitosa en la tabla tipo_marca id ${id} !!`)
        }
    })
});

router.delete('/marca/eliminar_registro', (req,res) => {
    const id = req.query.id;

    cnn_mysql.query(`DELETE FROM tipo_marca WHERE id_marca = ${id}`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.send(`Has eliminado con exito el registro con id ${id} en la tabla tipo_marca!!`)
        }
    })
});

router.get('/marca/cambiar-estado', (req, res) => {
    cnn_mysql.query(`SELECT id_marca, desc_marca, REPLACE(activo, 'S', 'Activo') AS activo FROM tipo_marca WHERE activo = 'S' UNION
    SELECT id_marca, desc_marca, REPLACE(activo, 'N', 'Inactivo') FROM tipo_marca WHERE activo = 'N'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset)
        }
    })
});

module.exports = router