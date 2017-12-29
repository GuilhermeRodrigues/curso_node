module.exports = function(application){
    application.get('/formulario_inclusao_noticia', function(req, res){
        res.render("admin/form_add_noticia");
    });

    application.post('/noticias/salvar', function(req, res){
        var noticia = req.body;

        function isValidDate(value) {
            if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
          
            const date = new Date(value);
            if (!date.getTime()) return false;
            return date.toISOString().slice(0, 10) === value;
          }

        req.assert('titulo', 'Título é obrigatório').notEmpty();
        req.assert('resumo', 'Resumo é obrigatório').notEmpty();
        req.assert('resumo', 'Resumo deve conter entre 10 e 100 caracteres').len(10, 100);
        req.assert('autor', 'Autor é obrigatório').notEmpty();
        //req.assert('data_noticia', 'Data é obrigatória').notEmpty().isDate();
        req.check('data_noticia').custom(isValidDate).withMessage('the date must be valid');
        req.assert('noticia', 'Notícia é obrigatória').notEmpty();

        var erros = req.validationErrors();

        if(erros){
            res.render("admin/form_add_noticia", {validacao : erros});
            return;
        }
        
        var connection = application.config.dbConnection();
        var noticiasModel = new application.app.models.NoticiasDAO(connection);

        noticiasModel.salvarNoticia(noticia, function(error, result){
            res.redirect('/noticias');
        });   
    });
};