import assign from 'deep-assign';

export default (...rules) => {
  const styles = assign(...rules);
  
  return Object.keys(styles).map(selector => {
    const properties = Object.keys(styles[selector]).map(prop => {
      return `${prop}: ${styles[selector][prop]};`;
    }).join('');

    return `${selector}{${properties}}`;
  }).join('');
};