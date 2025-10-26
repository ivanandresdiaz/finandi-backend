const formatNumber = (number: number | string) => {
  const toNumber = +number;
  if (toNumber > 0) {
    const num = Math.round(toNumber);
    const numberData = new Intl.NumberFormat().format(num);
    const string = `${numberData}`;
    return string.split(',').join('.');
  }
  return 0;
};
export default formatNumber;
