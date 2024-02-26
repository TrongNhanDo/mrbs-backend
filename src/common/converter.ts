export const convertToQuery = (params: object) => {
  const keyInputArr = Object.keys(params);
  const valInputArr = Object.values(params);
  const keyOutputArr: string[] = [];
  const valArr: any[] = [];

  if (keyInputArr && keyInputArr.length) {
    keyInputArr.map((key: string, index: number) => {
      valArr.push(valInputArr[index]);
      keyOutputArr.push(`${key} = ?`);
    });

    return {
      searchCondition: ' WHERE ' + keyOutputArr.join(' AND '),
      keys: keyInputArr,
      values: valArr
    };
  } else {
    return {
      searchCondition: '',
      keys: [],
      values: []
    };
  }
};
