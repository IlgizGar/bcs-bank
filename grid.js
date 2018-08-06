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
      fields: '20px',
    },
    md: {
      width: '992px',
      fields: '20px',
    },
    sm: {
      width: '768px',
      fields: '20px',
    },
    xs: {
      width: '576px',
      fields: '20px',
    },
  },
};
