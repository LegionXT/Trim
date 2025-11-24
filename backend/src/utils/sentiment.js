module.exports.getSentiment = (text) => {
  if (/angry|mad|frustrated|terrible|bad/.test(text.toLowerCase()))
    return "negative";

  return "neutral";
};
