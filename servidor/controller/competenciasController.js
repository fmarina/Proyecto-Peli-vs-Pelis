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
            
            if(competenciaResult.length === 0) return res.status(404).send("Error. La competencia con el identificador enviado no existe.");            
            
            const sql = "SELECT id, poster, titulo FROM pelicula ORDER BY RAND() LIMIT 2;";

            connection.query(sql, function(err, peliculaResult) {
                if(err) return res.status(404).send("Hubo un error en la consulta obtenerPeliculasAleatorias");

                const result = {
                    'peliculas'   : peliculaResult,             // [{id, poster, titulo}, {id, poster, titulo}]
                    'competencia' : competenciaResult[0].nombre // [{id, nombre}]
                }

                res.send(JSON.stringify(result));
            });
        });
    },

    votar: function (req, res) {

        let competencia_id = req.params.id;
        let pelicula_id = req.body.idPelicula;

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
}



module.exports = controller;