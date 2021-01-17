DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS tipo_linea;
DROP TABLE IF EXISTS tipo_marca;

CREATE TABLE vehiculos(
    nro_placa VARCHAR(10) PRIMARY KEY,
    id_linea INT(5) UNSIGNED NOT NULL,
    modelo ENUM('2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012',
    '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021') NOT NULL,
    fecha_ven_seguro DATE NOT NULL,
    fecha_ven_tecnomecanica DATE, --Puede ser nulo ya que si el veiculo esta nuevo no necesita tecnomecanica 
    fecha_ven_contratodo DATE --Puede ser nulo ya que el seguro contratodo no es obligatorio
);

CREATE TABLE tipo_linea(
    id_linea INT(5) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    desc_linea VARCHAR(100) UNIQUE NOT NULL,
    id_marca INT(5) UNSIGNED NOT NULL,
    activo ENUM('S', 'N') NOT NULL
);

CREATE TABLE tipo_marca(
    id_marca INT(5) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    desc_marca VARCHAR(100) UNIQUE NOT NULL,
    activo ENUM('S', 'N') NOT NULL
);

ALTER TABLE vehiculos 
ADD CONSTRAINT `fk_id_linea` 
FOREIGN KEY (`id_linea`) 
REFERENCES `tipo_linea` (`id_linea`);

ALTER TABLE tipo_linea 
ADD CONSTRAINT `fk_id_marca` 
FOREIGN KEY (`id_marca`) 
REFERENCES `tipo_marca` (`id_marca`);