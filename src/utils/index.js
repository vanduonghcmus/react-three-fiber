import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const calculateSizeByUnit = (value = 0, unit = 1) => {
  return unit * value;
};

export const angleToRadians = (angleInDeg) => (Math.PI / 180) * angleInDeg;

export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export const describeArc = (x, y, radius, startAngle, endAngle) => {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
};

export function createSideGeometry(
  baseGeometry,
  params,
  size,
  folds = [true, true, true, true],
  hasMiddleLayer = false
) {
  const geometriesToMerge = [];

  geometriesToMerge.push(
    getLayerGeometry(
      (v) => -0.5 * params.thickness + 0.01 * Math.sin(params.fluteFreq * v)
    )
  );
  geometriesToMerge.push(
    getLayerGeometry(
      (v) => 0.5 * params.thickness + 0.01 * Math.sin(params.fluteFreq * v)
    )
  );
  if (hasMiddleLayer) {
    geometriesToMerge.push(
      getLayerGeometry(
        (v) => 0.5 * params.thickness * Math.sin(params.fluteFreq * v)
      )
    );
  }

  function applyFolds(x, y, z) {
    let modifier = (c, s) => 1 - Math.pow(c / (0.5 * s), 10);
    if ((x > 0 && folds[1]) || (x < 0 && folds[3])) {
      z *= modifier(x, size[0]);
    }
    if ((y > 0 && folds[0]) || (y < 0 && folds[2])) {
      z *= modifier(y, size[1]);
    }
    return z;
  }

  function getLayerGeometry(offset) {
    const layerGeometry = baseGeometry.clone();
    const positionAttr = layerGeometry.attributes.position;
    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);
      let z = positionAttr.getZ(i) + offset(x);
      z = applyFolds(x, y, z);
      positionAttr.setXYZ(i, x, y, z);
    }
    return layerGeometry;
  }

  const mergedGeometry = mergeBufferGeometries(geometriesToMerge, true);
  mergedGeometry.computeVertexNormals();

  return mergedGeometry;
}
