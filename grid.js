module.exports = {
  outputStyle: 'styl', /* less || scss || sass || styl */
  columns: 12,
  offset: '40px', /* gutter width px || % || rem */
  mobileFirst: false,
  container: {
    maxWidth: '1240px',
    fields: '20px',
  },
  breakPoints: {
    lg: {
      width: '1240px',
    },
    md: {
      width: '992px',
    },
    sm: {
      width: '768px',
    },
    xs: {
      width: '576px',
    },
  },
};
