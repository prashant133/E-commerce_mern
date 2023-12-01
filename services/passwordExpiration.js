

const checkPasswordExpiration = (lastModifiedDate) => {
  const passwordExpirationDays = 90;
  const today = new Date();
  const passwordExpirationDate = new Date(lastModifiedDate);
  passwordExpirationDate.setDate(
    passwordExpirationDate.getDate() + passwordExpirationDays
  );

  return today > passwordExpirationDate;
};

module.exports = { checkPasswordExpiration };