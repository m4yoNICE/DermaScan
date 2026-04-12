export const formatConditionName = (name, status) => {
  if (status === "flagged") return "Flagged Content";
  if (!name) return "Out of Scope";

  //format the words by splitting by "-" and upper case the first letter of each word
  const words = name.split("-");
  const formatted = [];

  for (let i = 0; i < words.length; i++) {
    formatted.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
  }

  return formatted.join(" ");
};
