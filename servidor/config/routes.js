const competenciaController = require('../controller/competenciasController');

module.exports = function(app){
    app.get('/competencias', competenciaController.listarCompetencias);    
    app.get('/competencias/:id/peliculas', competenciaController.obtenerPeliculasAleatorias);
    app.post('/competencias/:id/voto', competenciaController.votar);
}