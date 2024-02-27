import Validator from 'validatorjs';

export const validationAddRoom = (params: any) => {
  const rules = {
    room_name: 'required',
    sort_key: 'required',
    area_id: 'required'
  };
  const validator = new Validator(params, rules, {});
  return validator;
};
