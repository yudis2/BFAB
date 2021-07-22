const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistsSongPayloadSchema } = require('./schema');

const PlaylistsSongValidator = {
  validatePlaylistsSongPayload: (payload) => {
    const validationResult = PlaylistsSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsSongValidator;
