export const formatBirthDateFromPersonalCode = (personalCode: number) => {
  const personalCodeStr = personalCode.toString();
  const centuryIndicator = personalCodeStr.charAt(0);
  const yearBase =
    centuryIndicator === "1" || centuryIndicator === "2"
      ? 1800
      : centuryIndicator === "3" || centuryIndicator === "4"
      ? 1900
      : 2000;

  const year = yearBase + parseInt(personalCodeStr.slice(1, 3), 10);
  const month = personalCodeStr.slice(3, 5);
  const day = personalCodeStr.slice(5, 7);

  return `${day}.${month}.${year}`;
};

export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(/\s+/);
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};
