/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    userName
    description
    location
    email
    game {
      nextToken
      __typename
    }
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userName
      description
      location
      email
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getGame = /* GraphQL */ `query GetGame($id: ID!) {
  getGame(id: $id) {
      id
      gameName
      gameDescriptionH2
      gameDescriptionH3
      gameDescriptionP
      gameLocationPlace
      gameLocationCity
      gameImage
      gameType
      gameLink
      gameGoals
      gameIntro
      gameMap
      gamePlayZone {
          items {
            id
            disabled
            gameID
            gameZoneName
            gameZoneIcon
            gameZoneImage
            gameZoneDescription
            order
            createdAt
            updatedAt
          }
          nextToken
        }
       gameHint {
          items {
            id
            disabled
            gameID
            gamePlayZoneID
            gameHintName
            gameHintDescription
            order
            createdAt
            updatedAt
          }
          nextToken
        }
      type
       gameClue {
          items {
            id
            gameClueName
            gamePlayZoneID
            gameClueIcon
            gameClueImage
            gameClueText
            gameCluePosition
            order
            createdAt
            updatedAt
          }
          nextToken
        }
      gamePuzzle {
        items {
            id
            gamePlayZoneID
            puzzleName
            puzzlePosition
            puzzleImage
            puzzleImageSolved
            textField {
              items {
                id
                name
                label
                answer
                order
                }
              nextToken
            }
            puzzleObjectClue
            puzzleClueText
            puzzleToolRevealed
            puzzleToolNeeded
            winGame
            order
            createdAt
            updatedAt
          }
          nextToken
        }
      createdAt
      disabled
      updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetGameQueryVariables, APITypes.GetGameQuery>;
export const listGames = /* GraphQL */ `query ListGames(
  $filter: ModelGameFilterInput
  $limit: Int
  $nextToken: String
) {
  listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameName
      gameDescriptionH2
      gameDescriptionH3
      gameDescriptionP
      gameLocationPlace
      gameLocationCity
      gameImage
      gameType
      gameLink
      gameGoals
      gameIntro
      gameMap
      gamePlayZone {
          items {
            id
            disabled
            gameID
            gameZoneName
            order
            createdAt
            updatedAt
          }
          nextToken
        }
       gameHint {
          items {
            id
            disabled
            gameID
            gamePlayZoneID
            gameHintName
            gameHintDescription
            order
            createdAt
            updatedAt
          }
          nextToken
        }
      type
       gameClue {
          items {
            id
            gameClueName
            gamePlayZoneID
            gameClueIcon
            gameClueImage
            gameClueText
            gameCluePosition
            order
            createdAt
            disabled
            updatedAt
          }
          nextToken
        }
      gamePuzzle {
        items {
            id
            gamePlayZoneID
            puzzleName
            puzzlePosition
            puzzleImage
            puzzleImageSolved
            textField {
              items {
                id
                name
                label
                answer
                order
                }
              nextToken
            }
            puzzleObjectClue
            puzzleClueText
            puzzleToolRevealed
            puzzleToolNeeded
            winGame
            order
            createdAt
            updatedAt
          }
          nextToken
        }
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTextFieldsQueryVariables,
  APITypes.ListTextFieldsQuery
>;
export const getGameStats = /* GraphQL */ `query GetGameStats($id: ID!) {
  getGameStats(id: $id) {
    id
    gameID
    userEmail
    gameLocationCity
    gameName
    gameStates
    gameScore {
      nextToken
      __typename
    }
    type
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGameStatsQueryVariables,
  APITypes.GetGameStatsQuery
>;
export const listGameStats = /* GraphQL */ `query ListGameStats(
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameStats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameID
      userEmail
      gameLocationCity
      gameName
      gameStates
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameStatsQueryVariables,
  APITypes.ListGameStatsQuery
>;
export const getGameScore = /* GraphQL */ `query GetGameScore($id: ID!) {
  getGameScore(id: $id) {
    id
    gameStatsID
    gameID
    numberOfPlayers
    teamName
    teamLocation
    gameComments
    gameTotalTime
    completed
    firstTime
    gameHintTime
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGameScoreQueryVariables,
  APITypes.GetGameScoreQuery
>;
export const listGameScores = /* GraphQL */ `query ListGameScores(
  $filter: ModelGameScoreFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameScores(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameStatsID
      gameID
      numberOfPlayers
      teamName
      teamLocation
      gameComments
      gameTotalTime
      completed
      firstTime
      gameHintTime
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameScoresQueryVariables,
  APITypes.ListGameScoresQuery
>;
export const getGameHint = /* GraphQL */ `query GetGameHint($id: ID!) {
  getGameHint(id: $id) {
    id
    gameID
    gamePlayZoneID
    gameHintName
    gameHintDescription
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGameHintQueryVariables,
  APITypes.GetGameHintQuery
>;
export const listGameHints = /* GraphQL */ `query ListGameHints(
  $filter: ModelGameHintFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameHints(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameID
      gamePlayZoneID
      gameHintName
      gameHintDescription
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameHintsQueryVariables,
  APITypes.ListGameHintsQuery
>;
export const getGameClue = /* GraphQL */ `query GetGameClue($id: ID!) {
  getGameClue(id: $id) {
    id
    gameID
    gamePlayZoneID
    gameClueName
    gameClueIcon
    gameClueImage
    gameClueText
    gameCluePosition
    gameClueToolNeeded
    order
    createdAt
    disabled
  }
}
` as GeneratedQuery<
  APITypes.GetGameClueQueryVariables,
  APITypes.GetGameClueQuery
>;
export const listGameClues = /* GraphQL */ `query ListGameClues(
  $filter: ModelGameClueFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameClues(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameID
      gamePlayZoneID
      gameClueName
      gameClueIcon
      gameClueImage
      gameClueText
      gameCluePosition
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameCluesQueryVariables,
  APITypes.ListGameCluesQuery
>;
export const getGamePlayZone = /* GraphQL */ `query GetGamePlayZone($id: ID!) {
  getGamePlayZone(id: $id) {
    id
    gameID
    gameZoneName
    gameZoneImage
    gameZoneDescription
    gameZoneIcon
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGamePlayZoneQueryVariables,
  APITypes.GetGamePlayZoneQuery
>;
export const listGamePlayZones = /* GraphQL */ `query ListGamePlayZones(
  $filter: ModelGamePlayZoneFilterInput
  $limit: Int
  $nextToken: String
) {
  listGamePlayZones(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameID
      gameZoneName
      gameZoneImage
      gameZoneDescription
      gameZoneIcon
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGamePlayZonesQueryVariables,
  APITypes.ListGamePlayZonesQuery
>;
export const getUserGamePlay = /* GraphQL */ `query GetUserGamePlay($id: ID!) {
  getUserGamePlay(id: $id) {
    id
    userId
    gameId
    user {
      id
      userName
      description
      location
      email
      createdAt
      disabled
      updatedAt
      __typename
    }
    game {
      id
      gameName
      gameDescriptionH2
      gameDescriptionH3
      gameDescriptionP
      gameLocationPlace
      gameLocationCity
      gameImage
      gameType
      gameLink
      gameGoals
      gameIntro
      gameMap
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserGamePlayQueryVariables,
  APITypes.GetUserGamePlayQuery
>;
export const listUserGamePlays = /* GraphQL */ `query ListUserGamePlays(
  $filter: ModelUserGamePlayFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserGamePlays(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      gameId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserGamePlaysQueryVariables,
  APITypes.ListUserGamePlaysQuery
>;
export const usersByEmail = /* GraphQL */ `query UsersByEmail(
  $email: String!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByEmail(
    email: $email
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userName
      description
      location
      email
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByEmailQueryVariables,
  APITypes.UsersByEmailQuery
>;
export const gamesByGameNameAndType = /* GraphQL */ `query GamesByGameNameAndType(
  $gameName: String!
  $type: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameFilterInput
  $limit: Int
  $nextToken: String
) {
  gamesByGameNameAndType(
    gameName: $gameName
    type: $type
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameName
      gameDescriptionH2
      gameDescriptionH3
      gameDescriptionP
      gameLocationPlace
      gameLocationCity
      gameImage
      gameType
      gameLink
      gameGoals
      gameIntro
      gameMap
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GamesByGameNameAndTypeQueryVariables,
  APITypes.GamesByGameNameAndTypeQuery
>;
export const gamesByCity = /* GraphQL */ `query GamesByCity(
  $type: String!
  $gameLocationCity: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameFilterInput
  $limit: Int
  $nextToken: String
) {
  gamesByCity(
    type: $type
    gameLocationCity: $gameLocationCity
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameName
      gameDescriptionH2
      gameDescriptionH3
      gameDescriptionP
      gameLocationPlace
      gameLocationCity
      gameImage
      gameType
      gameLink
      gameGoals
      gameIntro
      gameMap
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GamesByCityQueryVariables,
  APITypes.GamesByCityQuery
>;
export const gamePuzzleByGameID = /* GraphQL */ `query GamePuzzleByGameID(
  $gameID: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGamePuzzleFilterInput
  $limit: Int
  $nextToken: String
) {
  gamePuzzleByGameID(
    gameID: $gameID
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      gamePlayZoneID
      puzzleName
      puzzlePosition
      puzzleImage
      puzzleImageSolved
      puzzleObjectClue
      puzzleClueText
      puzzleToolRevealed
      puzzleToolNeeded
      winGame
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GamePuzzleByGameIDQueryVariables,
  APITypes.GamePuzzleByGameIDQuery
>;
export const textFieldByPuzzleID = /* GraphQL */ `query TextFieldByPuzzleID(
  $puzzleID: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelTextFieldFilterInput
  $limit: Int
  $nextToken: String
) {
  textFieldByPuzzleID(
    puzzleID: $puzzleID
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      puzzleID
      name
      label
      answer
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TextFieldByPuzzleIDQueryVariables,
  APITypes.TextFieldByPuzzleIDQuery
>;
export const gameStatsByGameID = /* GraphQL */ `query GameStatsByGameID(
  $gameID: String!
  $sortDirection: ModelSortDirection
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  gameStatsByGameID(
    gameID: $gameID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      userEmail
      gameLocationCity
      gameName
      gameStates
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameStatsByGameIDQueryVariables,
  APITypes.GameStatsByGameIDQuery
>;
export const gameStatsByUserEmail = /* GraphQL */ `query GameStatsByUserEmail(
  $userEmail: String!
  $sortDirection: ModelSortDirection
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  gameStatsByUserEmail(
    userEmail: $userEmail
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      userEmail
      gameLocationCity
      gameName
      gameStates
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameStatsByUserEmailQueryVariables,
  APITypes.GameStatsByUserEmailQuery
>;
export const gameStatsByGameName = /* GraphQL */ `query GameStatsByGameName(
  $gameName: String!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  gameStatsByGameName(
    gameName: $gameName
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      userEmail
      gameLocationCity
      gameName
      gameStates
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameStatsByGameNameQueryVariables,
  APITypes.GameStatsByGameNameQuery
>;
export const gameStatsSortedByGameName = /* GraphQL */ `query GameStatsSortedByGameName(
  $type: String!
  $gameName: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  gameStatsSortedByGameName(
    type: $type
    gameName: $gameName
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      userEmail
      gameLocationCity
      gameName
      gameStates
      type
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameStatsSortedByGameNameQueryVariables,
  APITypes.GameStatsSortedByGameNameQuery
>;
export const gameScoreByGameStatsID = /* GraphQL */ `query GameScoreByGameStatsID(
  $gameStatsID: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameScoreFilterInput
  $limit: Int
  $nextToken: String
) {
  gameScoreByGameStatsID(
    gameStatsID: $gameStatsID
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameStatsID
      gameID
      numberOfPlayers
      teamName
      teamLocation
      gameComments
      gameTotalTime
      completed
      firstTime
      gameHintTime
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameScoreByGameStatsIDQueryVariables,
  APITypes.GameScoreByGameStatsIDQuery
>;
export const gameScoreByGameID = /* GraphQL */ `query GameScoreByGameID(
  $gameID: ID!
  $gameTotalTime: ModelFloatKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameScoreFilterInput
  $limit: Int
  $nextToken: String
) {
  gameScoreByGameID(
    gameID: $gameID
    gameTotalTime: $gameTotalTime
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameStatsID
      gameID
      numberOfPlayers
      teamName
      teamLocation
      gameComments
      gameTotalTime
      completed
      firstTime
      gameHintTime
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameScoreByGameIDQueryVariables,
  APITypes.GameScoreByGameIDQuery
>;
export const gameHintByGameID = /* GraphQL */ `query GameHintByGameID(
  $gameID: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameHintFilterInput
  $limit: Int
  $nextToken: String
) {
  gameHintByGameID(
    gameID: $gameID
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      gamePlayZoneID
      gameHintName
      gameHintDescription
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameHintByGameIDQueryVariables,
  APITypes.GameHintByGameIDQuery
>;
export const gameClueByGameID = /* GraphQL */ `query GameClueByGameID(
  $gameID: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameClueFilterInput
  $limit: Int
  $nextToken: String
) {
  gameClueByGameID(
    gameID: $gameID
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      gamePlayZoneID
      gameClueName
      gameClueIcon
      gameClueImage
      gameClueText
      gameCluePosition
      gameClueToolNeeded
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameClueByGameIDQueryVariables,
  APITypes.GameClueByGameIDQuery
>;
export const gamePlayZoneByGameID = /* GraphQL */ `query GamePlayZoneByGameID(
  $gameID: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGamePlayZoneFilterInput
  $limit: Int
  $nextToken: String
) {
  gamePlayZoneByGameID(
    gameID: $gameID
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gameID
      gameZoneName
      gameZoneImage
      gameZoneDescription
      gameZoneIcon
      order
      createdAt
      disabled
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GamePlayZoneByGameIDQueryVariables,
  APITypes.GamePlayZoneByGameIDQuery
>;
export const userGamePlaysByUserId = /* GraphQL */ `query UserGamePlaysByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserGamePlayFilterInput
  $limit: Int
  $nextToken: String
) {
  userGamePlaysByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      gameId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserGamePlaysByUserIdQueryVariables,
  APITypes.UserGamePlaysByUserIdQuery
>;
export const userGamePlaysByGameId = /* GraphQL */ `query UserGamePlaysByGameId(
  $gameId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserGamePlayFilterInput
  $limit: Int
  $nextToken: String
) {
  userGamePlaysByGameId(
    gameId: $gameId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      gameId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserGamePlaysByGameIdQueryVariables,
  APITypes.UserGamePlaysByGameIdQuery
>;
export const getGamePuzzle = /* GraphQL */ `query GetGamePuzzle($id: ID!) {
  getGamePuzzle(id: $id) {
    id
    gameID
    gamePlayZoneID
    puzzleName
    puzzlePosition
    puzzleImage
    puzzleImageSolved
    puzzleObjectClue
    puzzleClueText
    puzzleToolRevealed
    puzzleToolNeeded
    winGame
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
    ` as GeneratedQuery<
    APITypes.UserGamePlaysByGameIdQueryVariables,
    APITypes.UserGamePlaysByGameIdQuery
    >;
export const getTextField= /* GraphQL */ `query GetTextField($id: ID!) {
  getTextField(id: $id) {
    id
    puzzleID
    name
    label
    answer
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
    ` as GeneratedQuery<
    APITypes.UserGamePlaysByGameIdQueryVariables,
    APITypes.UserGamePlaysByGameIdQuery
    >;