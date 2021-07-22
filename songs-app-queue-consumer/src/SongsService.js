const { Pool } = require('pg');
 
class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsPlaylist(playlistId) {
    const query = {
      text: `SELECT playlistsong.id,songs.title, songs.performer FROM playlistsong
      JOIN songs on playlistsong.song_id=songs.id
      WHERE playlistsong.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = SongsService;