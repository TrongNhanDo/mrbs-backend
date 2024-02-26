const convertToQuery = (params) => {
  const keyInputArr = Object.keys(params);
  const keyOutputArr = [];
  const valArr = [];

  if (keyInputArr && keyInputArr.length) {
    keyInputArr.map((key) => {
      valArr.push(params[key]);
      keyOutputArr.push(`${key} = ?`);
    });

    return {
      searchCondition: ' WHERE ' + keyOutputArr.join(' AND '),
      keys: keyInputArr,
      values: valArr,
    };
  } else {
    return {
      searchCondition: '',
      keys: [],
      values: [],
    };
  }
};

module.exports = {
  convertToQuery,
};
