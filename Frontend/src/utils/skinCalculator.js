export const calculateSkinType = (oilAnswers, senAnswers) => {
  const oilinessAvg =
    oilAnswers.reduce((sum, s) => sum + s, 0) / oilAnswers.length;
  const sensitivityAvg =
    senAnswers.reduce((sum, s) => sum + s, 0) / senAnswers.length;

  let skinType = "";
  if (oilinessAvg <= 2.5) skinType = "dry";
  else if (oilinessAvg <= 3.5) skinType = "combination";
  else skinType = "oily";

  const skinSensitivity = sensitivityAvg >= 3.0 ? "sensitive" : "resistant";

  return { skinType, skinSensitivity };
};