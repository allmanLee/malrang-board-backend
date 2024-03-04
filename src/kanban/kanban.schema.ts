import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsString, IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BoardStatus, Commit, Tag } from 'src/types/kanban.type';

const options: SchemaOptions = {
  timestamps: true,
};

export type Permission = 'admin' | 'user';

export interface readOnlyBoard {
  id: number;
  status: BoardStatus;
  title: string;
  kanbanId: string;
  teamId: string;
  permission: string;
  order: number;
}

export interface readOnlyCard {
  id: number;
  title: string;
  description: string;
  created_date: string;
  order: number;
  projectCardId: number;
  projectId: string;
  teamId: string;
  userId: string;
  userName: string;
  boardId: string;
  tags: Tag[];
  commit: Commit[];

  [key: string]: any; // Index signature allowing any additional properties
}

@Schema(options)
export class Board extends Document {
  @ApiProperty({
    example: 'title',
    description: 'Titile',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'status',
    description: '상태',
    // required: true,
  })
  @Prop({})
  status: BoardStatus;

  @ApiProperty({
    example: 'kanbanId',
    description:
      '칸반 ID - TODO 앞으로 여러개의 팀에 여러개의 칸반을 만들 수 있으므로',
    // required: true,
  })
  // @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  kanbanId: string;

  @ApiProperty({
    example: 'teamId',
    description: '팀 ID',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  teamId: string;

  @ApiProperty({
    example: 'permission',
    description:
      '권한 - 여러개의 칸반이 만들어지면 권한에 따라서 볼 수 있는 칸반이 다르다.',
    // required: true,
    enum: ['admin', 'user'],
  })
  @Prop({})
  permission: Permission;

  // 정렬 순서
  @ApiProperty({
    example: 'order',
    description: '정렬 순서',
    // required: true,
  })
  @Prop({})
  order: number;

  readonly readOnlyData: readOnlyBoard;
}

@Schema(options)
export class Card extends Document {
  @ApiProperty({
    example: 'title',
    description: 'Titile',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'description',
    description: '설명',
    required: true,
  })
  @Prop({})
  description: string;

  @ApiProperty({
    example: 'created_date',
    description: '생성 날짜',
    required: true,
  })
  @Prop({})
  created_date: string;

  @ApiProperty({
    example: 'order',
    description: '정렬 순서',
    required: true,
  })
  @Prop({})
  order: number;

  @ApiProperty({
    example: 'userId',
    description: '유저 인덱스',
    required: true,
  })
  @Prop({})
  userId: string;

  @ApiProperty({
    example: 'userName',
    description: '유저 이름',
    required: true,
  })
  @Prop({})
  userName: string;

  @ApiProperty({
    example: 'projectCardId',
    description: '프로젝트 기준 카드 인덱스',
    required: true,
  })
  @Prop({})
  projectCardId: number;

  @ApiProperty({
    example: 'teamId',
    description: '팀 인덱스',
    required: true,
  })
  @Prop({ required: true })
  teamId: string;

  @ApiProperty({
    example: 'boardId',
    description: '보드 인덱스',
    required: true,
  })
  @Prop({})
  boardId: string;

  @ApiProperty({
    example: 'projectId',
    description: '프로젝트 ID',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({
    example: 'tags',
    description: '태그',
    required: true,
  })
  @Prop({})
  tags: Tag[];

  @ApiProperty({
    example: 'commit',
    description: '커밋',
    required: true,
  })
  @Prop({})
  commit: Commit[];

  @Prop({ type: Object })
  optionalData: any;

  readonly readOnlyData: readOnlyCard;
}

// 필터뷰
@Schema(options)
export class FilterView extends Document {
  @ApiProperty({
    example: 'label',
    description: 'label',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    example: 'filters',
    description: '필터',
    required: true,
  })
  @Prop({ required: true, type: Object })
  filters: any;

  @ApiProperty({
    example: 'teamId',
    description: '팀 인덱스',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  teamId: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
export const CardSchema = SchemaFactory.createForClass(Card);
export const FilterViewSchema = SchemaFactory.createForClass(FilterView);

BoardSchema.virtual('readOnlyData').get(function (this: Board): readOnlyBoard {
  const { id, status, title, kanbanId, teamId, permission, order } = this;
  return { id, status, title, kanbanId, teamId, permission, order };
});

CardSchema.virtual('readOnlyData').get(function (this: Card): readOnlyCard {
  const {
    id,
    title,
    description,
    created_date,
    projectCardId,
    userId,
    userName,
    teamId,
    boardId,
    order,
    projectId,
    tags,
    commit,
  } = this;
  return {
    id,
    title,
    description,
    created_date,
    userId,
    teamId,
    userName,
    boardId,
    projectCardId,
    projectId,
    tags,
    order,
    commit,
  };
});
