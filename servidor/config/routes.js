const competenciaController = require('../controller/competenciasController');

module.exports = function(app){
    app.get('/generos', competenciaController.cargarGeneros);
    app.get('/directores', competenciaController.cargarDirectores);
    app.get('/actores', competenciaController.cargarActores);
    app.get('/competencias', competenciaController.listarCompetencias);    
    app.get('/competencias/:id/peliculas', competenciaController.obtenerPeliculasAleatorias);
    app.get('/competencias/:id/resultados', competenciaController.obtenerResultados);
    app.get('/competencias/:id', competenciaController.cargarCompetencia);
    app.post('/competencias/:id/voto', competenciaController.votar);    
    app.post('/competencias', competenciaController.crearNuevaCompetencia);
    app.put('/competencias/:id', competenciaController.editarNombreCompetencia);
    app.delete('/competencias/:id/votos', competenciaController.eliminarVotos); 
    app.delete('/competencias/:id', competenciaController.eliminarCompetencia);   
    
}