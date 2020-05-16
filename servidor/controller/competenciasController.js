const connection = require('../lib/conexiondb');

const controller = {

    listarCompetencias : function(req, res) {   

        const sql = "SELECT * FROM competencia";  

        connection.query(sql, function(err, results) {
            if(err) {
                console.log("Hubo un error en la consulta listarCompetencias", err.message);
                return res.status(404).send("Hubo un error en la consulta listarCompetencias");
            }

            res.send(JSON.stringify(results));
        });        
    },


    obtenerPeliculasAleatorias: function(req, res){

        const competencia_id = req.params.id;
        const sql = "SELECT * FROM competencia WHERE id = " + competencia_id;

        connection.query(sql, function(err, competenciaResult) {      

            if(err) return res.status(404).send("Hubo un error en la consulta obtenerPeliculasAleatorias");
            
            if(competenciaResult.length === 0) {
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            } 
            
            const sql = "SELECT id, poster, titulo FROM pelicula ORDER BY RAND() LIMIT 2;";

            connection.query(sql, function(err, peliculaResult) {
                if(err) return res.status(404).send("Hubo un error en la consulta obtenerPeliculasAleatorias");

                const result = {
                    'peliculas'   : peliculaResult,
                    'competencia' : competenciaResult[0].nombre
                }

                res.send(JSON.stringify(result));
            });
        });
    },


    votar: function (req, res) {

        const competencia_id = req.params.id;
        const pelicula_id = req.body.idPelicula;

        const sql = "INSERT INTO voto (competencia_id, pelicula_id) VALUES (?,?)";

        if(!pelicula_id) return res.status(404).send("Hubo un error con pelicula_id");

        connection.query(sql, [competencia_id, pelicula_id], function(err, results) {            
            
            if(err) {
                console.log("Hubo un error en el insert voto", err.message);
                return res.status(404).send("Hubo un error al tratar de insertar el voto");
            } 

            res.send(JSON.stringify(results));
        }); 
    },


    obtenerResultados: function(req, res) {

        const competencia_id = req.params.id;
        const sql = "SELECT * FROM competencia WHERE id = " + competencia_id; 
        
        connection.query(sql, function(err, competenciaResult) {
            if(err) {
                console.log("Error en id competencia", err.message);
                return res.status(404).send("Hubo un error en la consulta del id de competencia");
            }

            if(competenciaResult.length == 0){
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            }

            const sql = "SELECT voto.pelicula_id, poster, titulo, COUNT(pelicula_id) AS votos " +
                        "FROM voto " +
                        "JOIN pelicula ON pelicula_id = pelicula.id " +
                        "WHERE voto.competencia_id = " + competencia_id + " " +
                        "GROUP BY pelicula_id " +
                        "ORDER BY votos desc " +
                        "LIMIT 3";

            connection.query(sql, function(err, peliculaResults) {
                if(err) {
                    console.log("Error en la consulta de pelicula", err.message);
                    return res.status(404).send("Hubo un error en la consulta de peliculas resultados");
                }

                const resultado = {
                    'competencia' : competenciaResult[0].nombre,
                    'resultados'    : peliculaResults
                };
    
                res.send(JSON.stringify(resultado));

            });            

        });
    },


    crearNuevaCompetencia: function(req, res) {

        let nombre = req.body.nombre;
        const sql = "SELECT nombre FROM competencia where nombre = '" + nombre + "'";

        if(!nombre) return res.status(404).send("Error. Debe ingresar un nombre de competencia");
        
        connection.query(sql, function(err, resultNombre) {
            if(err) {
                console.log("Error en la consulta de competencias segun el nombre", err.message);
                return res.status(404).send("Hubo un error en la consulta de competencias segun nombre");
            }

            if(resultNombre.length === 1) return res.status(422).send("Error. Ese nombre de competencia ya existe");

            const sql1 = "INSERT INTO competencia (nombre) VALUES (?)";

            connection.query(sql1, [nombre], function(err, result) {
                if(err) return res.status(404).send("Hubo un error en el insert de nueva competencia");
                
                res.send(JSON.stringify(result));
            });

        });
    },


    
}



module.exports = controller;