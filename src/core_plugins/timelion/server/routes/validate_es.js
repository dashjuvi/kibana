'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (server) {
  server.route({
    method: 'GET',
    path: '/api/timelion/validate/es',
    handler: function handler(request, reply) {
      return request.getUiSettingsService().getAll().then(uiSettings => {
        var _server$plugins$elast = server.plugins.elasticsearch.getCluster('data');

        const callWithRequest = _server$plugins$elast.callWithRequest;


        const timefield = uiSettings['timelion:es.timefield'];

        const body = {
          index: uiSettings['es.default_index'],
          fields: timefield
        };

        callWithRequest(request, 'fieldStats', body).then(function (resp) {
          reply({
            ok: true,
            field: timefield,
            min: resp.indices._all.fields[timefield].min_value,
            max: resp.indices._all.fields[timefield].max_value
          });
        }).catch(function (resp) {
          reply({
            ok: false,
            resp: resp
          });
        });
      });
    }
  });
};

module.exports = exports['default'];
