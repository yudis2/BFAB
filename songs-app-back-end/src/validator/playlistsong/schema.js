const Joi = require('joi');

const PlaylistsSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistsSongPayloadSchema };
