export const calculateSkinType = (oilAnswers, senAnswers) => {
  const oilinessAvg =
    oilAnswers.reduce((sum, s) => sum + s, 0) / oilAnswers.length;
  const sensitivityAvg =
    senAnswers.reduce((sum, s) => sum + s, 0) / senAnswers.length;

  let skinType = "";
  if (oilinessAvg <= 2.5) skinType = "dry";
  else if (oilinessAvg <= 3.5) skinType = "combination";
  else skinType = "oily";

  let skinSensitivity = "";
  if (sensitivityAvg <= 2.0) skinSensitivity = "insensitive";
  else if (sensitivityAvg <= 3.0) skinSensitivity = "mild";
  else if (sensitivityAvg <= 4.0) skinSensitivity = "moderate";
  else skinSensitivity = "severe";

  return {
    skinType,
    skinSensitivity,
    description: `${skinSensitivity} ${skinType} skin`,
  };
};