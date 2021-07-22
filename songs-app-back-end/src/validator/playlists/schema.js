const Joi = require('joi');

const PlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlaylistsPayloadSchema };
