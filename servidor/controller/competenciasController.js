const connection = require('../lib/conexiondb');

const controller = {
    listarCompetencias : function(req, res) {
        
        const sql = "SELECT * FROM competencia";
        
        connection.query(sql, function(err, results) {
            if(err) return res.status(404).send("Hubo un error en la consulta cliente");
            console.log("results: ", JSON.stringify(results));
            res.send(JSON.stringify(results));
        });        
    },


}



module.exports = controller;