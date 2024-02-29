export type AddRoomProps = {
  room_name: string;
  sort_key: string;
  description: string;
  capacity: number;
  room_admin_email: string;
  disabled?: number;
};

export type UpdateRoomProps = {
  id: string;
  room_name: string;
  sort_key: string;
  description: string;
  capacity: number;
  room_admin_email: string;
  disabled?: number;
};

export type DeleteRoomProps = {
  id: string;
};

export type GetRoomsPaginate = {
  perPage: number;
  page: number;
};
