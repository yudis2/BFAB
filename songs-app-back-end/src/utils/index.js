const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  // eslint-disable-next-line camelcase
  inserted_at,
  // eslint-disable-next-line camelcase
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
