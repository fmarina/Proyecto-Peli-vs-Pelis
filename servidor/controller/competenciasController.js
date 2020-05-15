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
            
            const sql = "SELECT id, poster, titulo FROM pelicula ORDER BY RAND() LIMIT 2;";

            connection.query(sql, function(err, peliculaResult) {

                if(err) return res.status(404).send("Hubo un error en la consulta obtenerPeliculasAleatorias");
                
                const result = {
                    'peliculas'   : peliculaResult,
                    'competencia' : competenciaResult[0]
                }

                res.send(JSON.stringify(result));
            });
        });
    },
}



module.exports = controller;