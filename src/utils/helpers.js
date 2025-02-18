export const toTitle = (message) => {
  const words = message.split(' ');
  const titleMessage = words.map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
  return titleMessage;
};
