const { getAverageColor } = require("fast-average-color-node");

module.exports = getGradient = async (urlImage) => {
  const coverColor = {
    gradientStart: "",
    gradientEnd: "",
  };

  if (!urlImage) {
    coverColor.gradientStart = "rgba(182, 180, 193,1)";
    coverColor.gradientEnd = `rgba(182, 180, 193, 0)`;
    return { ...coverColor };
  } else {
    try {
      const color = await getAverageColor(urlImage, {
        width: 50,
      });
      const colorEnd = [].concat(color.value.slice(0, 3), 0).join(",");
      coverColor.gradientStart = color.rgba;
      coverColor.gradientEnd = `rgba(${colorEnd})`;
      return { ...coverColor };
    } catch (error) {
      coverColor.gradientStart = "rgba(182, 180, 193,1)";
      coverColor.gradientEnd = `rgba(182, 180, 193, 0)`;
      return { ...coverColor };
    }
  }
};
