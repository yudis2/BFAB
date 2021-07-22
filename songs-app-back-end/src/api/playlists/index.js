const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'PlaylistMusic',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);
    server.route(routes(playlistsHandler));
  },
};
