import { loadPage1Data } from '../controllers/page-data.controller';
import render from '../controllers/render.controller';

module.exports = (router) => {
  router.route('/api/page/1').get(loadPage1Data);

  // if at this point we don't have a route match for /api, return 404
  router.route('/api/*').all((req, res) =>
    res.status(404).send({
      error: `route not found: ${req.url}`,
    }),
  );

  // all other routes are handled by our render (html) controller
  router.route('*').all(render);
};
