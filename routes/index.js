
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'You on da\' landing page' });
};