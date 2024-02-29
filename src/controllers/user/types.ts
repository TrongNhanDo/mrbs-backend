import * as CommonTypes from '../../common/types';

export type AddUserProps = {
  level: number;
  name: string;
  display_name: string;
  password_hash: string;
  email: string;
  last_login: number;
};

export type UpdateUserProps = {
  id: number;
  level: number;
  display_name: string;
  password_hash: string;
  email: string;
};

export type ChangePwdProps = {
  id: number;
  password_hash: string;
};

export type DeleteUserProps = {
  id: number;
};

export type UserProps = {
  id: number;
  level: number;
  name: string;
  display_name: string;
  password_hash: string;
  email: string;
  last_login: number;
  reset_key_hash: string;
  reset_key_expiry: number;
  createdAt: string;
  updatedAt: string;
};

export type ResponseGetAllUsersProps = {
  userList: UserProps[];
  returnCnt: number;
} & CommonTypes.ResponseProps;

export type GetUserByIdProps = {
  userId: number;
};

export type UsersPanigateProps = {
  perPage: number;
  page: number;
};
