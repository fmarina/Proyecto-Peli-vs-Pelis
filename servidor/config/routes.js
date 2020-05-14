const competenciaController = require('../controller/competenciasController');

module.exports = function(app){
    app.get('/competencias', competenciaController.listarCompetencias);
}