const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist({
    playlistId, songId,
  }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlistsong VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    await this._cacheService.delete(`songs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsSong(playlistId) {
    try {
      const result = await this._cacheService.get(`songs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT playlistsong.id,songs.title, songs.performer FROM playlistsong
      JOIN songs on playlistsong.song_id=songs.id
      WHERE playlistsong.playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);
      await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  async deleteSongPlaylists(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsong WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('lagu gagal dihapus');
    }

    await this._cacheService.delete(`songs:${playlistId}`);
  }

  async verifyPlaylistSongOwner(playlistId, owner) {
    const query = {
      text: 'SELECT id FROM playlists JOIN playlistsong on playlist.id=playlistsong.playlist_id WHERE playlist.owner = $3',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    const playlists = result.rows[0];
    if (playlists.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistSongAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistSongOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
        console.log();
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistSongsService;
