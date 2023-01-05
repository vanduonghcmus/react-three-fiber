export const calculateSizeByUnit = (value = 0, unit = 1) => {
  return unit * value;
};

export const angleToRadians = (angleInDeg) => (Math.PI / 180) * angleInDeg;
