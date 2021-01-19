const {Router, json} = require('express');
const {cnn_mysql} = require('./../config/databases');
const router = Router();

router.post('/vehiculos/isertar', async(req, res) => {
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

router.get('/vehiculos/registros', (req, res) => {
    cnn_mysql.query(`SELECT * FROM vehiculos`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            cantidad = resulset.length;
            console.log(cantidad);
            if (cantidad != 30){
                return res.jsonp(`La cantidad ${cantidad} registros no es la esperada`);
            } else {
                return res.jsonp(`La cantidad ${cantidad} registros es correcta`);
            }
        }
    })
});

router.get('/vehiculos/modelo', (req, res) => {
    cnn_mysql.query('SELECT min(modelo) as min_modelo, max(modelo) as max_modelo FROM `vehiculos`', (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.send(resulset);
        }
    })
});

router.post('/vehiculos/fechas', (req, res) => {

    const fecha_ini = req.query.fecha_ini;
    const fecha_fin = req.query.fecha_fin;

    cnn_mysql.query(`SELECT * FROM vehiculos WHERE fecha_ven_seguro BETWEEN '${fecha_ini}' AND '${fecha_fin}'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.post('/vehiculos/modelos/rangos', (req, res) => {

    const modelo_ini = req.query.modelo_ini;
    const modelo_fin = req.query.modelo_fin;

    cnn_mysql.query(`SELECT * FROM vehiculos WHERE modelo BETWEEN '${modelo_ini}' AND '${modelo_fin}'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.get('/vehiculos/consulta_unica', (req, res) => {
    cnn_mysql.query(`SELECT nro_placa, modelo, desc_linea, desc_marca FROM vehiculos
    JOIN tipo_linea ON vehiculos.id_linea = tipo_linea.id_linea
    JOIN tipo_marca ON tipo_linea.id_marca = tipo_marca.id_marca`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.get('/vehiculos/consulta_unica_estado', (req, res) => {
    cnn_mysql.query(`SELECT nro_placa, modelo, desc_linea, desc_marca FROM vehiculos
    JOIN tipo_linea ON vehiculos.id_linea = tipo_linea.id_linea
    JOIN tipo_marca ON tipo_linea.id_marca = tipo_marca.id_marca WHERE tipo_linea.activo = 'S'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.get('/vehiculos/suma_modelos', (req, res) => {
    cnn_mysql.query(`SELECT modelo FROM vehiculos`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            let suma = 0
            for (let i = 0; i < resulset.length; i++) {
                suma += parseInt(resulset[i].modelo);
            }
            console.log(suma)
            return res.send(`La suma de todos los modelos es ${suma}`);
        }
    })
});

router.get('/vehiculos/promedio', (req, res) => {
    cnn_mysql.query(`SELECT modelo FROM vehiculos`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            let suma = 0
            for (let i = 0; i < resulset.length; i++) {
                suma += parseInt(resulset[i].modelo);
            }
            const promedio = parseInt(suma / resulset.length);
            return res.send(`El promedio de todos los modelos es ${promedio}`);
        }
    })
});

router.get('/vehiculos/inner-join', (req, res) => {
    cnn_mysql.query(`SELECT nro_placa, modelo, desc_linea, desc_marca FROM vehiculos
    INNER JOIN tipo_linea ON vehiculos.id_linea = tipo_linea.id_linea
    INNER JOIN tipo_marca ON tipo_linea.id_marca = tipo_marca.id_marca WHERE tipo_linea.activo = 'S'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.get('/vehiculos/left-join', (req, res) => {
    cnn_mysql.query(`SELECT nro_placa, modelo, desc_linea, desc_marca FROM vehiculos
    LEFT JOIN tipo_linea ON vehiculos.id_linea = tipo_linea.id_linea
    LEFT JOIN tipo_marca ON tipo_linea.id_marca = tipo_marca.id_marca WHERE tipo_linea.activo = 'S'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

router.get('/vehiculos/formatos', (req, res) => {
    cnn_mysql.query(`SELECT nro_placa, id_linea, modelo AS modeloVehiculo,
    DATE_FORMAT(fecha_ven_seguro,'%d - %b - %Y, %h, %i, $s') AS fecha_ven_seguro,
    DATE_FORMAT(fecha_ven_tecnomecanica,'%d - %b - %Y, %h, %i, $s') AS fecha_ven_tecnomecanica,
    DATE_FORMAT(fecha_ven_contratodo,'%d - %b - %Y, %h, %i, $s') AS fecha_ven_contratodo
    FROM vehiculos WHERE fecha_ven_tecnomecanica != 'NULL' || fecha_ven_contratodo != 'NULL'`, (error, resulset, fields) => {
        if (error) {
            return res.status(500).send('se presento un error en la base de datos.')
        } else {
            return res.json(resulset);
        }
    })
});

module.exports = router