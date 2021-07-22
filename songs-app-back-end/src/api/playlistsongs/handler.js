const ClientError = require('../../exceptions/ClientError');

class PlaylistsSongHandler {
  constructor(playlistSongsService, playlistsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistsSongHandler = this.postPlaylistsSongHandler.bind(this);
    this.getPlaylistsSongHandler = this.getPlaylistsSongHandler.bind(this);
    this.deletePlaylistsSongByIdHandler = this.deletePlaylistsSongByIdHandler.bind(this);
  }

  async postPlaylistsSongHandler(request, h) {
    try {
      this._validator.validatePlaylistsSongPayload(request.payload);
      const {
        songId,
      } = request.payload;
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.addSongToPlaylist({
        songId, playlistId,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',

      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsSongHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._playlistSongsService.getPlaylistsSong(playlistId);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',

      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistsSongByIdHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.deleteSongPlaylists(
        playlistId, songId,
      );
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',

      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsSongHandler;
