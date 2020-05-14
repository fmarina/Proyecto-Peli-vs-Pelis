USE `competencias`;

DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(700) NOT NULL,
  PRIMARY KEY (`id`)
) 