/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const nameToColor = (name: string, s: number = 70, l: number = 30) => {
  if (!name) return "#777";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
};

export const shadeColor = (color: any, amount: number) =>
  "#" +
  color
    .replace(/^#/, "")
    .replace(/../g, (color: any) =>
      (
        "0" +
        Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
      ).substr(-2),
    );

// shadeColor('#ffffff', -20) => "#ebebeb"
// shadeColor('000000', 20) => "#141414"
