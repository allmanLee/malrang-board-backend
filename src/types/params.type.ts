export type getProjectParams = {
  groupId?: number;
  projectId?: number;
  isDeleted?: boolean;
};

export type getTeamPrams = {
  groupId?: number;
  teamId?: number;
  isDeleted?: boolean;
};

export type getGroupPrams = {
  groupId?: number;
  isDeleted?: boolean;
};

export type getMemberPrams = {
  groupId?: number;
  member_id?: number;
  isDeleted?: boolean;
};

export type getUsersParams = {
  groupId?: number;
  boardId?: number;
  isDeleted?: boolean;
};

export type getBoardsParams = {
  teamId?: number;
  boardId?: number;
  isDeleted?: boolean;
};
