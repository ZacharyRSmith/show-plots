// @flow
export const getGraphHeight = () => {
  const base = window.screen.availHeight - 270 - (window.screen.height - window.screen.availHeight);
  if (window.screen.width >= 768) {
   return base;
  } else {
   return base - 70;
  }
  }

export const getPointHeight = () =>
  getGraphHeight() / 10;
