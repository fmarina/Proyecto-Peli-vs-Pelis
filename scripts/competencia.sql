USE `competencias`;

DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(700) NOT NULL,
  PRIMARY KEY (`id`)
)


DROP TABLE IF EXISTS `voto`;

CREATE TABLE `voto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `competencia_id` INT NOT NULL,
  `pelicula_id` INT(11) UNSIGNED NOT NULL, 
  PRIMARY KEY (id),
  FOREIGN KEY (competencia_id) REFERENCES competencia (id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula (id)
);


