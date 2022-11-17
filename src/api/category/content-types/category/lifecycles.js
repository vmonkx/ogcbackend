const getGradient = require("../../../../helpers/getGradient");

module.exports = {
  afterUpdate: async (event) => {
    const { result, data, params } = event;

    if (!result.coverColor) {
      return result;
    }

    if (
      result.coverColor.gradientStart &&
      result.coverColor.gradientEnd &&
      result.coverColor.urlImage
    ) {
      return result;
    }

    const newCoverColor = {
      ...result.coverColor,
    };

    const gradient = await getGradient(result.coverColor.urlImage);

    newCoverColor.gradientStart = gradient.gradientStart;
    newCoverColor.gradientEnd = gradient.gradientEnd;

    const entry = await strapi.entityService.update(
      "api::category.category",
      result.id,
      {
        data: {
          coverColor: {
            ...newCoverColor,
          },
        },
      }
    );

    result.coverColor = { ...newCoverColor };
    return result;
  },
};
