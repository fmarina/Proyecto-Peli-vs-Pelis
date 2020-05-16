const competenciaController = require('../controller/competenciasController');

module.exports = function(app){
    app.get('/competencias', competenciaController.listarCompetencias);    
    app.get('/competencias/:id/peliculas', competenciaController.obtenerPeliculasAleatorias);
    app.post('/competencias/:id/voto', competenciaController.votar);
    app.get('/competencias/:id/resultados', competenciaController.obtenerResultados);
    app.post('/competencias', competenciaController.crearNuevaCompetencia);
    app.delete('/competencias/:id/votos', competenciaController.eliminarVoto);
}