/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  userName?: string | null,
  description?: string | null,
  location?: string | null,
  email: string,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type ModelUserConditionInput = {
  userName?: ModelStringInput | null,
  description?: ModelStringInput | null,
  location?: ModelStringInput | null,
  email?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type User = {
  __typename: "User",
  id: string,
  userName?: string | null,
  description?: string | null,
  location?: string | null,
  email: string,
  game?: ModelUserGamePlayConnection | null,
  createdAt: string,
  disabled?: boolean | null,
  updatedAt: string,
};

export type ModelUserGamePlayConnection = {
  __typename: "ModelUserGamePlayConnection",
  items:  Array<UserGamePlay | null >,
  nextToken?: string | null,
};

export type UserGamePlay = {
  __typename: "UserGamePlay",
  id: string,
  userId: string,
  gameId: string,
  user: User,
  game: Game,
  createdAt: string,
  updatedAt: string,
};

export type Game = {
  __typename: "Game",
  id: string,
  gameName: string,
  gameDescriptionH2?: string | null,
  gameDescriptionH3?: string | null,
  gameDescriptionP?: string | null,
  gameLocationPlace?: string | null,
  gameLocationCity: string,
  gameImage?: string | null,
  gameType?: string | null,
  gameLink?: string | null,
  gameGoals?: string | null,
  gameIntro?: string | null,
  gameMap?: string | null,
  gamePlayZone?: ModelGamePlayZoneConnection | null,
  gameHint?: ModelGameHintConnection | null,
  type: string,
  gameClues?: string | null,
  gamePuzzles?: string | null,
  gameObjects?: string | null,
  createdAt: string,
  disabled?: boolean | null,
  user?: ModelUserGamePlayConnection | null,
  updatedAt: string,
};

export type ModelGamePlayZoneConnection = {
  __typename: "ModelGamePlayZoneConnection",
  items:  Array<GamePlayZone | null >,
  nextToken?: string | null,
};

export type GamePlayZone = {
  __typename: "GamePlayZone",
  id: string,
  gameID: string,
  gameZoneName?: string | null,
  gameZoneImage?: string | null,
  gameZoneDescription?: string | null,
  order: number,
  createdAt: string,
  disabled?: boolean | null,
  updatedAt: string,
};

export type ModelGameHintConnection = {
  __typename: "ModelGameHintConnection",
  items:  Array<GameHint | null >,
  nextToken?: string | null,
};

export type GameHint = {
  __typename: "GameHint",
  id: string,
  gameID: string,
  gameHintName?: string | null,
  gameHintDescription?: string | null,
  order: number,
  createdAt: string,
  disabled?: boolean | null,
  updatedAt: string,
};

export type UpdateUserInput = {
  id: string,
  userName?: string | null,
  description?: string | null,
  location?: string | null,
  email?: string | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateGameInput = {
  id?: string | null,
  gameName: string,
  gameDescriptionH2?: string | null,
  gameDescriptionH3?: string | null,
  gameDescriptionP?: string | null,
  gameLocationPlace?: string | null,
  gameLocationCity: string,
  gameImage?: string | null,
  gameType?: string | null,
  gameLink?: string | null,
  gameGoals?: string | null,
  gameIntro?: string | null,
  gameMap?: string | null,
  type: string,
  gameClues?: string | null,
  gamePuzzles?: string | null,
  gameObjects?: string | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type ModelGameConditionInput = {
  gameName?: ModelStringInput | null,
  gameDescriptionH2?: ModelStringInput | null,
  gameDescriptionH3?: ModelStringInput | null,
  gameDescriptionP?: ModelStringInput | null,
  gameLocationPlace?: ModelStringInput | null,
  gameLocationCity?: ModelStringInput | null,
  gameImage?: ModelStringInput | null,
  gameType?: ModelStringInput | null,
  gameLink?: ModelStringInput | null,
  gameGoals?: ModelStringInput | null,
  gameIntro?: ModelStringInput | null,
  gameMap?: ModelStringInput | null,
  type?: ModelStringInput | null,
  gameClues?: ModelStringInput | null,
  gamePuzzles?: ModelStringInput | null,
  gameObjects?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameConditionInput | null > | null,
  or?: Array< ModelGameConditionInput | null > | null,
  not?: ModelGameConditionInput | null,
};

export type UpdateGameInput = {
  id: string,
  gameName?: string | null,
  gameDescriptionH2?: string | null,
  gameDescriptionH3?: string | null,
  gameDescriptionP?: string | null,
  gameLocationPlace?: string | null,
  gameLocationCity?: string | null,
  gameImage?: string | null,
  gameType?: string | null,
  gameLink?: string | null,
  gameGoals?: string | null,
  gameIntro?: string | null,
  gameMap?: string | null,
  type?: string | null,
  gameClues?: string | null,
  gamePuzzles?: string | null,
  gameObjects?: string | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type DeleteGameInput = {
  id: string,
};

export type CreateGameStatsInput = {
  id?: string | null,
  gameID: string,
  userEmail: string,
  gameLocationCity?: string | null,
  gameName: string,
  gameStates?: string | null,
  type: string,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type ModelGameStatsConditionInput = {
  gameID?: ModelStringInput | null,
  userEmail?: ModelStringInput | null,
  gameLocationCity?: ModelStringInput | null,
  gameName?: ModelStringInput | null,
  gameStates?: ModelStringInput | null,
  type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameStatsConditionInput | null > | null,
  or?: Array< ModelGameStatsConditionInput | null > | null,
  not?: ModelGameStatsConditionInput | null,
};

export type GameStats = {
  __typename: "GameStats",
  id: string,
  gameID: string,
  userEmail: string,
  gameLocationCity?: string | null,
  gameName: string,
  gameStates?: string | null,
  gameScore?: ModelGameScoreConnection | null,
  type: string,
  createdAt: string,
  disabled?: boolean | null,
  updatedAt: string,
};

export type ModelGameScoreConnection = {
  __typename: "ModelGameScoreConnection",
  items:  Array<GameScore | null >,
  nextToken?: string | null,
};

export type GameScore = {
  __typename: "GameScore",
  id: string,
  gameStatsID: string,
  gameID: string,
  numberOfPlayers?: string | null,
  teamName?: string | null,
  teamLocation?: string | null,
  gameComments?: string | null,
  gameTotalTime: number,
  completed?: boolean | null,
  firstTime?: boolean | null,
  gameHintTime: number,
  createdAt: string,
  disabled?: boolean | null,
  updatedAt: string,
};

export type UpdateGameStatsInput = {
  id: string,
  gameID?: string | null,
  userEmail?: string | null,
  gameLocationCity?: string | null,
  gameName?: string | null,
  gameStates?: string | null,
  type?: string | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type DeleteGameStatsInput = {
  id: string,
};

export type CreateGameScoreInput = {
  id?: string | null,
  gameStatsID: string,
  gameID: string,
  numberOfPlayers?: string | null,
  teamName?: string | null,
  teamLocation?: string | null,
  gameComments?: string | null,
  gameTotalTime: number,
  completed?: boolean | null,
  firstTime?: boolean | null,
  gameHintTime: number,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type ModelGameScoreConditionInput = {
  gameStatsID?: ModelIDInput | null,
  gameID?: ModelIDInput | null,
  numberOfPlayers?: ModelStringInput | null,
  teamName?: ModelStringInput | null,
  teamLocation?: ModelStringInput | null,
  gameComments?: ModelStringInput | null,
  gameTotalTime?: ModelFloatInput | null,
  completed?: ModelBooleanInput | null,
  firstTime?: ModelBooleanInput | null,
  gameHintTime?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameScoreConditionInput | null > | null,
  or?: Array< ModelGameScoreConditionInput | null > | null,
  not?: ModelGameScoreConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateGameScoreInput = {
  id: string,
  gameStatsID?: string | null,
  gameID?: string | null,
  numberOfPlayers?: string | null,
  teamName?: string | null,
  teamLocation?: string | null,
  gameComments?: string | null,
  gameTotalTime?: number | null,
  completed?: boolean | null,
  firstTime?: boolean | null,
  gameHintTime?: number | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type DeleteGameScoreInput = {
  id: string,
};

export type CreateGameHintInput = {
  id?: string | null,
  gameID: string,
  gameHintName?: string | null,
  gameHintDescription?: string | null,
  order: number,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type ModelGameHintConditionInput = {
  gameID?: ModelIDInput | null,
  gameHintName?: ModelStringInput | null,
  gameHintDescription?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameHintConditionInput | null > | null,
  or?: Array< ModelGameHintConditionInput | null > | null,
  not?: ModelGameHintConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateGameHintInput = {
  id: string,
  gameID?: string | null,
  gameHintName?: string | null,
  gameHintDescription?: string | null,
  order?: number | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type DeleteGameHintInput = {
  id: string,
};

export type CreateGamePlayZoneInput = {
  id?: string | null,
  gameID: string,
  gameZoneName?: string | null,
  gameZoneImage?: string | null,
  gameZoneDescription?: string | null,
  order: number,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type ModelGamePlayZoneConditionInput = {
  gameID?: ModelIDInput | null,
  gameZoneName?: ModelStringInput | null,
  gameZoneImage?: ModelStringInput | null,
  gameZoneDescription?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGamePlayZoneConditionInput | null > | null,
  or?: Array< ModelGamePlayZoneConditionInput | null > | null,
  not?: ModelGamePlayZoneConditionInput | null,
};

export type UpdateGamePlayZoneInput = {
  id: string,
  gameID?: string | null,
  gameZoneName?: string | null,
  gameZoneImage?: string | null,
  gameZoneDescription?: string | null,
  order?: number | null,
  createdAt?: string | null,
  disabled?: boolean | null,
};

export type DeleteGamePlayZoneInput = {
  id: string,
};

export type CreateUserGamePlayInput = {
  id?: string | null,
  userId: string,
  gameId: string,
};

export type ModelUserGamePlayConditionInput = {
  userId?: ModelIDInput | null,
  gameId?: ModelIDInput | null,
  and?: Array< ModelUserGamePlayConditionInput | null > | null,
  or?: Array< ModelUserGamePlayConditionInput | null > | null,
  not?: ModelUserGamePlayConditionInput | null,
};

export type UpdateUserGamePlayInput = {
  id: string,
  userId?: string | null,
  gameId?: string | null,
};

export type DeleteUserGamePlayInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  userName?: ModelStringInput | null,
  description?: ModelStringInput | null,
  location?: ModelStringInput | null,
  email?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelGameFilterInput = {
  id?: ModelIDInput | null,
  gameName?: ModelStringInput | null,
  gameDescriptionH2?: ModelStringInput | null,
  gameDescriptionH3?: ModelStringInput | null,
  gameDescriptionP?: ModelStringInput | null,
  gameLocationPlace?: ModelStringInput | null,
  gameLocationCity?: ModelStringInput | null,
  gameImage?: ModelStringInput | null,
  gameType?: ModelStringInput | null,
  gameLink?: ModelStringInput | null,
  gameGoals?: ModelStringInput | null,
  gameIntro?: ModelStringInput | null,
  gameMap?: ModelStringInput | null,
  type?: ModelStringInput | null,
  gameClues?: ModelStringInput | null,
  gamePuzzles?: ModelStringInput | null,
  gameObjects?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameFilterInput | null > | null,
  or?: Array< ModelGameFilterInput | null > | null,
  not?: ModelGameFilterInput | null,
};

export type ModelGameConnection = {
  __typename: "ModelGameConnection",
  items:  Array<Game | null >,
  nextToken?: string | null,
};

export type ModelGameStatsFilterInput = {
  id?: ModelIDInput | null,
  gameID?: ModelStringInput | null,
  userEmail?: ModelStringInput | null,
  gameLocationCity?: ModelStringInput | null,
  gameName?: ModelStringInput | null,
  gameStates?: ModelStringInput | null,
  type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameStatsFilterInput | null > | null,
  or?: Array< ModelGameStatsFilterInput | null > | null,
  not?: ModelGameStatsFilterInput | null,
};

export type ModelGameStatsConnection = {
  __typename: "ModelGameStatsConnection",
  items:  Array<GameStats | null >,
  nextToken?: string | null,
};

export type ModelGameScoreFilterInput = {
  id?: ModelIDInput | null,
  gameStatsID?: ModelIDInput | null,
  gameID?: ModelIDInput | null,
  numberOfPlayers?: ModelStringInput | null,
  teamName?: ModelStringInput | null,
  teamLocation?: ModelStringInput | null,
  gameComments?: ModelStringInput | null,
  gameTotalTime?: ModelFloatInput | null,
  completed?: ModelBooleanInput | null,
  firstTime?: ModelBooleanInput | null,
  gameHintTime?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameScoreFilterInput | null > | null,
  or?: Array< ModelGameScoreFilterInput | null > | null,
  not?: ModelGameScoreFilterInput | null,
};

export type ModelGameHintFilterInput = {
  id?: ModelIDInput | null,
  gameID?: ModelIDInput | null,
  gameHintName?: ModelStringInput | null,
  gameHintDescription?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGameHintFilterInput | null > | null,
  or?: Array< ModelGameHintFilterInput | null > | null,
  not?: ModelGameHintFilterInput | null,
};

export type ModelGamePlayZoneFilterInput = {
  id?: ModelIDInput | null,
  gameID?: ModelIDInput | null,
  gameZoneName?: ModelStringInput | null,
  gameZoneImage?: ModelStringInput | null,
  gameZoneDescription?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  disabled?: ModelBooleanInput | null,
  and?: Array< ModelGamePlayZoneFilterInput | null > | null,
  or?: Array< ModelGamePlayZoneFilterInput | null > | null,
  not?: ModelGamePlayZoneFilterInput | null,
};

export type ModelUserGamePlayFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  gameId?: ModelIDInput | null,
  and?: Array< ModelUserGamePlayFilterInput | null > | null,
  or?: Array< ModelUserGamePlayFilterInput | null > | null,
  not?: ModelUserGamePlayFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelFloatKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userName?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  location?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  disabled?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionGameFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gameName?: ModelSubscriptionStringInput | null,
  gameDescriptionH2?: ModelSubscriptionStringInput | null,
  gameDescriptionH3?: ModelSubscriptionStringInput | null,
  gameDescriptionP?: ModelSubscriptionStringInput | null,
  gameLocationPlace?: ModelSubscriptionStringInput | null,
  gameLocationCity?: ModelSubscriptionStringInput | null,
  gameImage?: ModelSubscriptionStringInput | null,
  gameType?: ModelSubscriptionStringInput | null,
  gameLink?: ModelSubscriptionStringInput | null,
  gameGoals?: ModelSubscriptionStringInput | null,
  gameIntro?: ModelSubscriptionStringInput | null,
  gameMap?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  gameClues?: ModelSubscriptionStringInput | null,
  gamePuzzles?: ModelSubscriptionStringInput | null,
  gameObjects?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  disabled?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionGameFilterInput | null > | null,
  or?: Array< ModelSubscriptionGameFilterInput | null > | null,
};

export type ModelSubscriptionGameStatsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gameID?: ModelSubscriptionStringInput | null,
  userEmail?: ModelSubscriptionStringInput | null,
  gameLocationCity?: ModelSubscriptionStringInput | null,
  gameName?: ModelSubscriptionStringInput | null,
  gameStates?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  disabled?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionGameStatsFilterInput | null > | null,
  or?: Array< ModelSubscriptionGameStatsFilterInput | null > | null,
};

export type ModelSubscriptionGameScoreFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gameStatsID?: ModelSubscriptionIDInput | null,
  gameID?: ModelSubscriptionIDInput | null,
  numberOfPlayers?: ModelSubscriptionStringInput | null,
  teamName?: ModelSubscriptionStringInput | null,
  teamLocation?: ModelSubscriptionStringInput | null,
  gameComments?: ModelSubscriptionStringInput | null,
  gameTotalTime?: ModelSubscriptionFloatInput | null,
  completed?: ModelSubscriptionBooleanInput | null,
  firstTime?: ModelSubscriptionBooleanInput | null,
  gameHintTime?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  disabled?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionGameScoreFilterInput | null > | null,
  or?: Array< ModelSubscriptionGameScoreFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionGameHintFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gameID?: ModelSubscriptionIDInput | null,
  gameHintName?: ModelSubscriptionStringInput | null,
  gameHintDescription?: ModelSubscriptionStringInput | null,
  order?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  disabled?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionGameHintFilterInput | null > | null,
  or?: Array< ModelSubscriptionGameHintFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionGamePlayZoneFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gameID?: ModelSubscriptionIDInput | null,
  gameZoneName?: ModelSubscriptionStringInput | null,
  gameZoneImage?: ModelSubscriptionStringInput | null,
  gameZoneDescription?: ModelSubscriptionStringInput | null,
  order?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  disabled?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionGamePlayZoneFilterInput | null > | null,
  or?: Array< ModelSubscriptionGamePlayZoneFilterInput | null > | null,
};

export type ModelSubscriptionUserGamePlayFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  gameId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionUserGamePlayFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserGamePlayFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type CreateGameMutationVariables = {
  input: CreateGameInput,
  condition?: ModelGameConditionInput | null,
};

export type CreateGameMutation = {
  createGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateGameMutationVariables = {
  input: UpdateGameInput,
  condition?: ModelGameConditionInput | null,
};

export type UpdateGameMutation = {
  updateGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteGameMutationVariables = {
  input: DeleteGameInput,
  condition?: ModelGameConditionInput | null,
};

export type DeleteGameMutation = {
  deleteGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateGameStatsMutationVariables = {
  input: CreateGameStatsInput,
  condition?: ModelGameStatsConditionInput | null,
};

export type CreateGameStatsMutation = {
  createGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type UpdateGameStatsMutationVariables = {
  input: UpdateGameStatsInput,
  condition?: ModelGameStatsConditionInput | null,
};

export type UpdateGameStatsMutation = {
  updateGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type DeleteGameStatsMutationVariables = {
  input: DeleteGameStatsInput,
  condition?: ModelGameStatsConditionInput | null,
};

export type DeleteGameStatsMutation = {
  deleteGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type CreateGameScoreMutationVariables = {
  input: CreateGameScoreInput,
  condition?: ModelGameScoreConditionInput | null,
};

export type CreateGameScoreMutation = {
  createGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type UpdateGameScoreMutationVariables = {
  input: UpdateGameScoreInput,
  condition?: ModelGameScoreConditionInput | null,
};

export type UpdateGameScoreMutation = {
  updateGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type DeleteGameScoreMutationVariables = {
  input: DeleteGameScoreInput,
  condition?: ModelGameScoreConditionInput | null,
};

export type DeleteGameScoreMutation = {
  deleteGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type CreateGameHintMutationVariables = {
  input: CreateGameHintInput,
  condition?: ModelGameHintConditionInput | null,
};

export type CreateGameHintMutation = {
  createGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type UpdateGameHintMutationVariables = {
  input: UpdateGameHintInput,
  condition?: ModelGameHintConditionInput | null,
};

export type UpdateGameHintMutation = {
  updateGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type DeleteGameHintMutationVariables = {
  input: DeleteGameHintInput,
  condition?: ModelGameHintConditionInput | null,
};

export type DeleteGameHintMutation = {
  deleteGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type CreateGamePlayZoneMutationVariables = {
  input: CreateGamePlayZoneInput,
  condition?: ModelGamePlayZoneConditionInput | null,
};

export type CreateGamePlayZoneMutation = {
  createGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type UpdateGamePlayZoneMutationVariables = {
  input: UpdateGamePlayZoneInput,
  condition?: ModelGamePlayZoneConditionInput | null,
};

export type UpdateGamePlayZoneMutation = {
  updateGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type DeleteGamePlayZoneMutationVariables = {
  input: DeleteGamePlayZoneInput,
  condition?: ModelGamePlayZoneConditionInput | null,
};

export type DeleteGamePlayZoneMutation = {
  deleteGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type CreateUserGamePlayMutationVariables = {
  input: CreateUserGamePlayInput,
  condition?: ModelUserGamePlayConditionInput | null,
};

export type CreateUserGamePlayMutation = {
  createUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserGamePlayMutationVariables = {
  input: UpdateUserGamePlayInput,
  condition?: ModelUserGamePlayConditionInput | null,
};

export type UpdateUserGamePlayMutation = {
  updateUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserGamePlayMutationVariables = {
  input: DeleteUserGamePlayInput,
  condition?: ModelUserGamePlayConditionInput | null,
};

export type DeleteUserGamePlayMutation = {
  deleteUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGameQueryVariables = {
  id: string,
};

export type GetGameQuery = {
  getGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type ListGamesQueryVariables = {
  filter?: ModelGameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGamesQuery = {
  listGames?:  {
    __typename: "ModelGameConnection",
    items:  Array< {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGameStatsQueryVariables = {
  id: string,
};

export type GetGameStatsQuery = {
  getGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type ListGameStatsQueryVariables = {
  filter?: ModelGameStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGameStatsQuery = {
  listGameStats?:  {
    __typename: "ModelGameStatsConnection",
    items:  Array< {
      __typename: "GameStats",
      id: string,
      gameID: string,
      userEmail: string,
      gameLocationCity?: string | null,
      gameName: string,
      gameStates?: string | null,
      type: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGameScoreQueryVariables = {
  id: string,
};

export type GetGameScoreQuery = {
  getGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type ListGameScoresQueryVariables = {
  filter?: ModelGameScoreFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGameScoresQuery = {
  listGameScores?:  {
    __typename: "ModelGameScoreConnection",
    items:  Array< {
      __typename: "GameScore",
      id: string,
      gameStatsID: string,
      gameID: string,
      numberOfPlayers?: string | null,
      teamName?: string | null,
      teamLocation?: string | null,
      gameComments?: string | null,
      gameTotalTime: number,
      completed?: boolean | null,
      firstTime?: boolean | null,
      gameHintTime: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGameHintQueryVariables = {
  id: string,
};

export type GetGameHintQuery = {
  getGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type ListGameHintsQueryVariables = {
  filter?: ModelGameHintFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGameHintsQuery = {
  listGameHints?:  {
    __typename: "ModelGameHintConnection",
    items:  Array< {
      __typename: "GameHint",
      id: string,
      gameID: string,
      gameHintName?: string | null,
      gameHintDescription?: string | null,
      order: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGamePlayZoneQueryVariables = {
  id: string,
};

export type GetGamePlayZoneQuery = {
  getGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type ListGamePlayZonesQueryVariables = {
  filter?: ModelGamePlayZoneFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGamePlayZonesQuery = {
  listGamePlayZones?:  {
    __typename: "ModelGamePlayZoneConnection",
    items:  Array< {
      __typename: "GamePlayZone",
      id: string,
      gameID: string,
      gameZoneName?: string | null,
      gameZoneImage?: string | null,
      gameZoneDescription?: string | null,
      order: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserGamePlayQueryVariables = {
  id: string,
};

export type GetUserGamePlayQuery = {
  getUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserGamePlaysQueryVariables = {
  filter?: ModelUserGamePlayFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserGamePlaysQuery = {
  listUserGamePlays?:  {
    __typename: "ModelUserGamePlayConnection",
    items:  Array< {
      __typename: "UserGamePlay",
      id: string,
      userId: string,
      gameId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GamesByGameNameAndTypeQueryVariables = {
  gameName: string,
  type?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GamesByGameNameAndTypeQuery = {
  gamesByGameNameAndType?:  {
    __typename: "ModelGameConnection",
    items:  Array< {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GamesByCityQueryVariables = {
  type: string,
  gameLocationCity?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GamesByCityQuery = {
  gamesByCity?:  {
    __typename: "ModelGameConnection",
    items:  Array< {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameStatsByGameIDQueryVariables = {
  gameID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameStatsByGameIDQuery = {
  gameStatsByGameID?:  {
    __typename: "ModelGameStatsConnection",
    items:  Array< {
      __typename: "GameStats",
      id: string,
      gameID: string,
      userEmail: string,
      gameLocationCity?: string | null,
      gameName: string,
      gameStates?: string | null,
      type: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameStatsByUserEmailQueryVariables = {
  userEmail: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameStatsByUserEmailQuery = {
  gameStatsByUserEmail?:  {
    __typename: "ModelGameStatsConnection",
    items:  Array< {
      __typename: "GameStats",
      id: string,
      gameID: string,
      userEmail: string,
      gameLocationCity?: string | null,
      gameName: string,
      gameStates?: string | null,
      type: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameStatsByGameNameQueryVariables = {
  gameName: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameStatsByGameNameQuery = {
  gameStatsByGameName?:  {
    __typename: "ModelGameStatsConnection",
    items:  Array< {
      __typename: "GameStats",
      id: string,
      gameID: string,
      userEmail: string,
      gameLocationCity?: string | null,
      gameName: string,
      gameStates?: string | null,
      type: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameStatsSortedByGameNameQueryVariables = {
  type: string,
  gameName?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameStatsSortedByGameNameQuery = {
  gameStatsSortedByGameName?:  {
    __typename: "ModelGameStatsConnection",
    items:  Array< {
      __typename: "GameStats",
      id: string,
      gameID: string,
      userEmail: string,
      gameLocationCity?: string | null,
      gameName: string,
      gameStates?: string | null,
      type: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameScoreByGameStatsIDQueryVariables = {
  gameStatsID: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameScoreFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameScoreByGameStatsIDQuery = {
  gameScoreByGameStatsID?:  {
    __typename: "ModelGameScoreConnection",
    items:  Array< {
      __typename: "GameScore",
      id: string,
      gameStatsID: string,
      gameID: string,
      numberOfPlayers?: string | null,
      teamName?: string | null,
      teamLocation?: string | null,
      gameComments?: string | null,
      gameTotalTime: number,
      completed?: boolean | null,
      firstTime?: boolean | null,
      gameHintTime: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameScoreByGameIDQueryVariables = {
  gameID: string,
  gameTotalTime?: ModelFloatKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameScoreFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameScoreByGameIDQuery = {
  gameScoreByGameID?:  {
    __typename: "ModelGameScoreConnection",
    items:  Array< {
      __typename: "GameScore",
      id: string,
      gameStatsID: string,
      gameID: string,
      numberOfPlayers?: string | null,
      teamName?: string | null,
      teamLocation?: string | null,
      gameComments?: string | null,
      gameTotalTime: number,
      completed?: boolean | null,
      firstTime?: boolean | null,
      gameHintTime: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameHintByGameIDQueryVariables = {
  gameID: string,
  order?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameHintFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameHintByGameIDQuery = {
  gameHintByGameID?:  {
    __typename: "ModelGameHintConnection",
    items:  Array< {
      __typename: "GameHint",
      id: string,
      gameID: string,
      gameHintName?: string | null,
      gameHintDescription?: string | null,
      order: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GamePlayZoneByGameIDQueryVariables = {
  gameID: string,
  order?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGamePlayZoneFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GamePlayZoneByGameIDQuery = {
  gamePlayZoneByGameID?:  {
    __typename: "ModelGamePlayZoneConnection",
    items:  Array< {
      __typename: "GamePlayZone",
      id: string,
      gameID: string,
      gameZoneName?: string | null,
      gameZoneImage?: string | null,
      gameZoneDescription?: string | null,
      order: number,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserGamePlaysByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserGamePlayFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserGamePlaysByUserIdQuery = {
  userGamePlaysByUserId?:  {
    __typename: "ModelUserGamePlayConnection",
    items:  Array< {
      __typename: "UserGamePlay",
      id: string,
      userId: string,
      gameId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserGamePlaysByGameIdQueryVariables = {
  gameId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserGamePlayFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserGamePlaysByGameIdQuery = {
  userGamePlaysByGameId?:  {
    __typename: "ModelUserGamePlayConnection",
    items:  Array< {
      __typename: "UserGamePlay",
      id: string,
      userId: string,
      gameId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    userName?: string | null,
    description?: string | null,
    location?: string | null,
    email: string,
    game?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnCreateGameSubscriptionVariables = {
  filter?: ModelSubscriptionGameFilterInput | null,
};

export type OnCreateGameSubscription = {
  onCreateGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameSubscriptionVariables = {
  filter?: ModelSubscriptionGameFilterInput | null,
};

export type OnUpdateGameSubscription = {
  onUpdateGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameSubscriptionVariables = {
  filter?: ModelSubscriptionGameFilterInput | null,
};

export type OnDeleteGameSubscription = {
  onDeleteGame?:  {
    __typename: "Game",
    id: string,
    gameName: string,
    gameDescriptionH2?: string | null,
    gameDescriptionH3?: string | null,
    gameDescriptionP?: string | null,
    gameLocationPlace?: string | null,
    gameLocationCity: string,
    gameImage?: string | null,
    gameType?: string | null,
    gameLink?: string | null,
    gameGoals?: string | null,
    gameIntro?: string | null,
    gameMap?: string | null,
    gamePlayZone?:  {
      __typename: "ModelGamePlayZoneConnection",
      nextToken?: string | null,
    } | null,
    gameHint?:  {
      __typename: "ModelGameHintConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    gameClues?: string | null,
    gamePuzzles?: string | null,
    gameObjects?: string | null,
    createdAt: string,
    disabled?: boolean | null,
    user?:  {
      __typename: "ModelUserGamePlayConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateGameStatsSubscriptionVariables = {
  filter?: ModelSubscriptionGameStatsFilterInput | null,
};

export type OnCreateGameStatsSubscription = {
  onCreateGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameStatsSubscriptionVariables = {
  filter?: ModelSubscriptionGameStatsFilterInput | null,
};

export type OnUpdateGameStatsSubscription = {
  onUpdateGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameStatsSubscriptionVariables = {
  filter?: ModelSubscriptionGameStatsFilterInput | null,
};

export type OnDeleteGameStatsSubscription = {
  onDeleteGameStats?:  {
    __typename: "GameStats",
    id: string,
    gameID: string,
    userEmail: string,
    gameLocationCity?: string | null,
    gameName: string,
    gameStates?: string | null,
    gameScore?:  {
      __typename: "ModelGameScoreConnection",
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnCreateGameScoreSubscriptionVariables = {
  filter?: ModelSubscriptionGameScoreFilterInput | null,
};

export type OnCreateGameScoreSubscription = {
  onCreateGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameScoreSubscriptionVariables = {
  filter?: ModelSubscriptionGameScoreFilterInput | null,
};

export type OnUpdateGameScoreSubscription = {
  onUpdateGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameScoreSubscriptionVariables = {
  filter?: ModelSubscriptionGameScoreFilterInput | null,
};

export type OnDeleteGameScoreSubscription = {
  onDeleteGameScore?:  {
    __typename: "GameScore",
    id: string,
    gameStatsID: string,
    gameID: string,
    numberOfPlayers?: string | null,
    teamName?: string | null,
    teamLocation?: string | null,
    gameComments?: string | null,
    gameTotalTime: number,
    completed?: boolean | null,
    firstTime?: boolean | null,
    gameHintTime: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnCreateGameHintSubscriptionVariables = {
  filter?: ModelSubscriptionGameHintFilterInput | null,
};

export type OnCreateGameHintSubscription = {
  onCreateGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameHintSubscriptionVariables = {
  filter?: ModelSubscriptionGameHintFilterInput | null,
};

export type OnUpdateGameHintSubscription = {
  onUpdateGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameHintSubscriptionVariables = {
  filter?: ModelSubscriptionGameHintFilterInput | null,
};

export type OnDeleteGameHintSubscription = {
  onDeleteGameHint?:  {
    __typename: "GameHint",
    id: string,
    gameID: string,
    gameHintName?: string | null,
    gameHintDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnCreateGamePlayZoneSubscriptionVariables = {
  filter?: ModelSubscriptionGamePlayZoneFilterInput | null,
};

export type OnCreateGamePlayZoneSubscription = {
  onCreateGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateGamePlayZoneSubscriptionVariables = {
  filter?: ModelSubscriptionGamePlayZoneFilterInput | null,
};

export type OnUpdateGamePlayZoneSubscription = {
  onUpdateGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteGamePlayZoneSubscriptionVariables = {
  filter?: ModelSubscriptionGamePlayZoneFilterInput | null,
};

export type OnDeleteGamePlayZoneSubscription = {
  onDeleteGamePlayZone?:  {
    __typename: "GamePlayZone",
    id: string,
    gameID: string,
    gameZoneName?: string | null,
    gameZoneImage?: string | null,
    gameZoneDescription?: string | null,
    order: number,
    createdAt: string,
    disabled?: boolean | null,
    updatedAt: string,
  } | null,
};

export type OnCreateUserGamePlaySubscriptionVariables = {
  filter?: ModelSubscriptionUserGamePlayFilterInput | null,
};

export type OnCreateUserGamePlaySubscription = {
  onCreateUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserGamePlaySubscriptionVariables = {
  filter?: ModelSubscriptionUserGamePlayFilterInput | null,
};

export type OnUpdateUserGamePlaySubscription = {
  onUpdateUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserGamePlaySubscriptionVariables = {
  filter?: ModelSubscriptionUserGamePlayFilterInput | null,
};

export type OnDeleteUserGamePlaySubscription = {
  onDeleteUserGamePlay?:  {
    __typename: "UserGamePlay",
    id: string,
    userId: string,
    gameId: string,
    user:  {
      __typename: "User",
      id: string,
      userName?: string | null,
      description?: string | null,
      location?: string | null,
      email: string,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    game:  {
      __typename: "Game",
      id: string,
      gameName: string,
      gameDescriptionH2?: string | null,
      gameDescriptionH3?: string | null,
      gameDescriptionP?: string | null,
      gameLocationPlace?: string | null,
      gameLocationCity: string,
      gameImage?: string | null,
      gameType?: string | null,
      gameLink?: string | null,
      gameGoals?: string | null,
      gameIntro?: string | null,
      gameMap?: string | null,
      type: string,
      gameClues?: string | null,
      gamePuzzles?: string | null,
      gameObjects?: string | null,
      createdAt: string,
      disabled?: boolean | null,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};
