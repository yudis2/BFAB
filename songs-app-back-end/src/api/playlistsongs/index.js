const PlaylistsSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'AddSongPlaylistMusic',
  version: '1.0.0',
  register: async (server, { playlistSongsService, playlistsService, validator }) => {
    // eslint-disable-next-line max-len
    const playlistsSongHandler = new PlaylistsSongHandler(playlistSongsService, playlistsService, validator);
    server.route(routes(playlistsSongHandler));
  },
};
