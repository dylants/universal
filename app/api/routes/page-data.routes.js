import { loadPage1Data } from '../controllers/page-data.controller';

module.exports = (router) => {
  router.route('/api/page/1').get(loadPage1Data);
};
