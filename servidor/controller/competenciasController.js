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
            
            let sql = "SELECT DISTINCT pelicula.id, poster, titulo FROM pelicula " +
                      "JOIN director_pelicula ON pelicula_id = pelicula.id " +
                      "JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id"
                      "WHERE true = true ";
            
            let genero_id   = competenciaResult[0].genero_id;
            let director_id = competenciaResult[0].director_id;
            let actor_id    = competenciaResult[0].actor_id;
            
            let genero   = genero_id   ? " AND genero_id = "   + genero_id   : ""; 
            let director = director_id ? " AND director_id = " + director_id : "";
            let actor    = actor_id    ? " AND actor_id = "    + actor_id    : "";
            
            let orderBy = " ORDER BY RAND() LIMIT 2;";

            sql = sql + genero + director + actor + orderBy;

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

        const nombre = req.body.nombre;

        if(!nombre) return res.status(422).send("Error. Debe ingresar un nombre de competencia");
        if(nombre.length < 3) return res.status(422).send("Error. El nombre de competencia debe ser mayor a 3 caracteres");

        const genero_id   = req.body.genero   !== '0' ? req.body.genero   : null;
        const director_id = req.body.director !== '0' ? req.body.director : null;
        const actor_id    = req.body.actor    !== '0' ? req.body.actor    : null;

        const sql = "SELECT * FROM competencia where nombre = '" + nombre + "'"; 
        
        connection.query(sql, function(err, resultNombre) {

            if(err) {
                console.log("Error en la consulta de competencias segun el nombre", err.message);
                return res.status(404).send("Hubo un error en la consulta de competencias segun nombre");
            }

            if(resultNombre.length === 1) return res.status(422).send("Error. Ese nombre de competencia ya existe");            
            
            let totalResultados = "SELECT count(*) as totalResultados " + 
                                  "FROM pelicula " +
                                  "JOIN director_pelicula ON pelicula_id = pelicula.id " +
                                  "JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id " +
                                  "WHERE true = true";
            
            let genero   = genero_id   !== null ? " AND genero_id = "   + genero_id   : "";
            let director = director_id !== null ? " AND director_id = " + director_id : "";
            let actor    = actor_id    !== null ? " AND actor_id = "    + actor_id    : "";

            totalResultados = totalResultados + genero + director + actor;

            connection.query(totalResultados, function(err, totalResults) {

                if(err) {
                    console.log("Error en la consulta totalResultados", err.message);
                    return res.status(404).send("Hubo un error en la consulta totalResultados");
                }
                
                if(totalResults[0].totalResultados < 2) return res.status(422).send("No se puede crear la competencia. No hay al menos dos peliculas con el criterio elegido");
                
                const sql = "INSERT INTO competencia (nombre, genero_id, director_id, actor_id) VALUES (?,?,?,?);";
                
                connection.query(sql, [nombre, genero_id, director_id, actor_id], function(err, result) {
                    if(err) return res.status(404).send("Hubo un error en el insert de nueva competencia");
                    
                    res.send(JSON.stringify(result));
                });
            });
        });
    },


    eliminarVotos: function(req, res) {

        const competencia_id = req.params.id;
        const sql = "SELECT * FROM competencia WHERE id = " + competencia_id;
        
        connection.query(sql, function(err, competenciaResult) {

            if(err) {
                console.log("Error en la consulta competencias segun id", err.message);
                return res.status(404).send("Hubo un error en la consulta competencias segun id");
            }

            if(competenciaResult.length === 0) return res.status(422).send("Error. No se encuentra ninguna competencia con ese id");

            const sql = "DELETE FROM voto WHERE competencia_id = " + competencia_id;

            connection.query(sql, function(err, deleteResult) {
                if(err) return res.status(404).send("Hubo un error al intentar eliminar los votos de una competencia");

                res.send(JSON.stringify(deleteResult));
            });
        });
    },


    cargarGeneros: function(req, res) {

        const sql = "SELECT * FROM genero";
        connection.query(sql, function(err, results) {
            if(err) {
                console.log("Error en la consulta generos", err.message);
                return res.status(404).send("Hubo un error en la consulta generos");
            }

            res.send(JSON.stringify(results));
        });
    },


    cargarDirectores: function(req, res){

        const sql = "SELECT * FROM director;"
        connection.query(sql, function(err, results) {
            if(err) {
                console.log("Error en la consulta director", err.message);
                return res.status(404).send("Hubo un error en la consulta director");
            }

            res.send(JSON.stringify(results));
        });
    },


    cargarActores: function(req, res) {
        const sql = "SELECT * FROM actor;";
        connection.query(sql, function(err, results) {
            if(err) {
                console.log("Error en la consulta actores", err.message);
                return res.status(404).send("Hubo un error en la consulta actores");
            }

            res.send(JSON.stringify(results));
        });
    },


    eliminarCompetencia: function(req, res) {

        const competencia_id = req.params.id;
        const sql = "SELECT * FROM competencia WHERE id = " + competencia_id;

        connection.query(sql, function(err, result) {

            if(err) return res.status(404).send("Hubo un error en la consulta competencias segun id");

            if(result.length === 0) return res.status(404).send("Error. No se encuentra ninguna competencia con ese id");

            const sql = "DELETE FROM voto WHERE competencia_id = " + competencia_id;

            connection.query(sql, function(err) {

                if(err) return res.status(404).send("Hubo un error al intentar eliminar el voto");

                const sql = "DELETE FROM competencia WHERE id = " + competencia_id;

                connection.query(sql, function(err, deleteCompetencia) {

                    if(err) return res.status(404).send("Hubo un error al intentar eliminar la competecia");

                    res.send(JSON.stringify(deleteCompetencia));
                });
            });
        });
    },


    editarNombreCompetencia: function(req, res) {

        const competencia_id = req.params.id;
        const nombreNuevo = req.body.nombre;

        if(!nombreNuevo) return res.status(422).send("Error. Debe ingresar un nombre de competencia");
        if(nombreNuevo.length < 3) return res.status(422).send("Error. El nombre de competencia debe ser mayor a 3 caracteres"); 

        const sql = "SELECT * FROM competencia WHERE id = " + competencia_id;        

        connection.query(sql, function(err, result) {

            if(err) return res.status(404).send("Hubo un error en la consulta de competencia segun id");

            if(result.length === 0) return res.status(404).send("No se encontró ninguna competencia con ese id");

            const sql = "SELECT * FROM competencia WHERE nombre = '" + nombreNuevo + "'";

            connection.query(sql, function (err, resultByName) {

                if(err) return res.status(404).send("Hubo un error en la consulta de competencia segun el nombre");
                
                if(resultByName.length === 1) return res.status(422).send("Error. Ese nombre de competencia ya existe"); 

                const sql = "UPDATE competencia " + "SET nombre = '" + nombreNuevo + "' WHERE id = " + competencia_id;

                connection.query(sql, function(err, resultEdition) {

                    if(err) return res.status(404).send("Hubo un error al intentar editar el nombre de competencia");

                    res.send(JSON.stringify(resultEdition));
                });
            });
        });    
    },


    cargarCompetencia: function(req, res) {

        const competencia_id = req.params.id;

        const sql = "SELECT competencia.nombre AS nombreCompetencia, genero.nombre AS genero, " + 
                    "director.nombre AS director, actor.nombre AS actor " + 
                    "FROM competencia " +
                    "LEFT JOIN genero ON competencia.genero_id = genero.id " + 
                    "LEFT JOIN director ON competencia.director_id = director.id " +
                    "LEFT JOIN actor ON competencia.actor_id = actor.id " + 
                    "WHERE competencia.id = " + competencia_id;

        connection.query(sql, function(err, results) {
            
            if(err) {
                console.log("Error en la consulta de cargar competencia", err.message);
                return res.status(404).send("Hubo un error en la consulta al cargar competencia");
            }

            const resultado = {
                'nombre'          : results[0].nombreCompetencia,
                'genero_nombre'   : results[0].genero,
                'director_nombre' : results[0].director,
                'actor_nombre'    : results[0].actor
            }

            res.send(JSON.stringify(resultado));
        });        
    }

}


module.exports = controller;