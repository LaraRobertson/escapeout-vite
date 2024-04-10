/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createGame = /* GraphQL */ `mutation CreateGame(
  $input: CreateGameInput!
  $condition: ModelGameConditionInput
) {
  createGame(input: $input, condition: $condition) {
    id
    gameName
    gameDescriptionH2
    gameDescriptionH3
    gameDescriptionP
    gameLocationPlace
    gameLocationPlaceDetails
    gameLocationCity
    gameDesigner
    gameLevel
    walkingDistance
    playZones
    gameImage
    gameType
    gameWinMessage
    gameWinImage
    gameGoals
    gameIntro
    gameMap
    gamePlayZone {
      nextToken
      __typename
    }
    gameHint {
      nextToken
      __typename
    }
    type
    gameClue {
      nextToken
      __typename
    }
    gamePuzzle {
      nextToken
      __typename
    }
    createdAt
    disabled
    user {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGameMutationVariables,
  APITypes.CreateGameMutation
>;
export const updateGame = /* GraphQL */ `mutation UpdateGame(
  $input: UpdateGameInput!
  $condition: ModelGameConditionInput
) {
  updateGame(input: $input, condition: $condition) {
    id
    gameName
    gameDescriptionH2
    gameDescriptionH3
    gameDescriptionP
    gameLocationPlace
    gameLocationPlaceDetails
    gameLocationCity
    gameDesigner
    gameLevel
    walkingDistance
    playZones
    gameImage
    gameType
    gameWinMessage
    gameWinImage
    gameGoals
    gameIntro
    gameMap
    gamePlayZone {
      nextToken
      __typename
    }
    gameHint {
      nextToken
      __typename
    }
    type
    gameClue {
      nextToken
      __typename
    }
    gamePuzzle {
      nextToken
      __typename
    }
    createdAt
    disabled
    user {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGameMutationVariables,
  APITypes.UpdateGameMutation
>;
export const deleteGame = /* GraphQL */ `mutation DeleteGame(
  $input: DeleteGameInput!
  $condition: ModelGameConditionInput
) {
  deleteGame(input: $input, condition: $condition) {
    id
    gameName
    gameDescriptionH2
    gameDescriptionH3
    gameDescriptionP
    gameLocationPlace
    gameLocationPlaceDetails
    gameLocationCity
    gameDesigner
    gameLevel
    walkingDistance
    playZones
    gameImage
    gameType
    gameWinMessage
    gameWinImage
    gameGoals
    gameIntro
    gameMap
    gamePlayZone {
      nextToken
      __typename
    }
    gameHint {
      nextToken
      __typename
    }
    type
    gameClue {
      nextToken
      __typename
    }
    gamePuzzle {
      nextToken
      __typename
    }
    createdAt
    disabled
    user {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGameMutationVariables,
  APITypes.DeleteGameMutation
>;
export const createGamePuzzle = /* GraphQL */ `mutation CreateGamePuzzle(
  $input: CreateGamePuzzleInput!
  $condition: ModelGamePuzzleConditionInput
) {
  createGamePuzzle(input: $input, condition: $condition) {
    id
    gameID
    gamePlayZoneID
    puzzleName
    puzzlePosition
    puzzleImage
    puzzleImageOpen
    puzzleImageSolved
    textField {
      nextToken
      __typename
    }
    puzzleClueRevealed
    puzzleClueText
    puzzleToolRevealed
    puzzleToolNeeded
    winGame
    winGameImage
    winGameMessage
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGamePuzzleMutationVariables,
  APITypes.CreateGamePuzzleMutation
>;
export const updateGamePuzzle = /* GraphQL */ `mutation UpdateGamePuzzle(
  $input: UpdateGamePuzzleInput!
  $condition: ModelGamePuzzleConditionInput
) {
  updateGamePuzzle(input: $input, condition: $condition) {
    id
    gameID
    gamePlayZoneID
    puzzleName
    puzzlePosition
    puzzleImage
    puzzleImageOpen
    puzzleImageSolved
    textField {
      nextToken
      __typename
    }
    puzzleClueRevealed
    puzzleClueText
    puzzleToolRevealed
    puzzleToolNeeded
    winGame
    winGameImage
    winGameMessage
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGamePuzzleMutationVariables,
  APITypes.UpdateGamePuzzleMutation
>;
export const deleteGamePuzzle = /* GraphQL */ `mutation DeleteGamePuzzle(
  $input: DeleteGamePuzzleInput!
  $condition: ModelGamePuzzleConditionInput
) {
  deleteGamePuzzle(input: $input, condition: $condition) {
    id
    gameID
    gamePlayZoneID
    puzzleName
    puzzlePosition
    puzzleImage
    puzzleImageOpen
    puzzleImageSolved
    textField {
      nextToken
      __typename
    }
    puzzleClueRevealed
    puzzleClueText
    puzzleToolRevealed
    puzzleToolNeeded
    winGame
    winGameImage
    winGameMessage
    order
    createdAt
    disabled
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGamePuzzleMutationVariables,
  APITypes.DeleteGamePuzzleMutation
>;
export const createTextField = /* GraphQL */ `mutation CreateTextField(
  $input: CreateTextFieldInput!
  $condition: ModelTextFieldConditionInput
) {
  createTextField(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTextFieldMutationVariables,
  APITypes.CreateTextFieldMutation
>;
export const updateTextField = /* GraphQL */ `mutation UpdateTextField(
  $input: UpdateTextFieldInput!
  $condition: ModelTextFieldConditionInput
) {
  updateTextField(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTextFieldMutationVariables,
  APITypes.UpdateTextFieldMutation
>;
export const deleteTextField = /* GraphQL */ `mutation DeleteTextField(
  $input: DeleteTextFieldInput!
  $condition: ModelTextFieldConditionInput
) {
  deleteTextField(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTextFieldMutationVariables,
  APITypes.DeleteTextFieldMutation
>;
export const createGameStats = /* GraphQL */ `mutation CreateGameStats(
  $input: CreateGameStatsInput!
  $condition: ModelGameStatsConditionInput
) {
  createGameStats(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGameStatsMutationVariables,
  APITypes.CreateGameStatsMutation
>;
export const updateGameStats = /* GraphQL */ `mutation UpdateGameStats(
  $input: UpdateGameStatsInput!
  $condition: ModelGameStatsConditionInput
) {
  updateGameStats(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGameStatsMutationVariables,
  APITypes.UpdateGameStatsMutation
>;
export const deleteGameStats = /* GraphQL */ `mutation DeleteGameStats(
  $input: DeleteGameStatsInput!
  $condition: ModelGameStatsConditionInput
) {
  deleteGameStats(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGameStatsMutationVariables,
  APITypes.DeleteGameStatsMutation
>;
export const createGameScore = /* GraphQL */ `mutation CreateGameScore(
  $input: CreateGameScoreInput!
  $condition: ModelGameScoreConditionInput
) {
  createGameScore(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGameScoreMutationVariables,
  APITypes.CreateGameScoreMutation
>;
export const updateGameScore = /* GraphQL */ `mutation UpdateGameScore(
  $input: UpdateGameScoreInput!
  $condition: ModelGameScoreConditionInput
) {
  updateGameScore(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGameScoreMutationVariables,
  APITypes.UpdateGameScoreMutation
>;
export const deleteGameScore = /* GraphQL */ `mutation DeleteGameScore(
  $input: DeleteGameScoreInput!
  $condition: ModelGameScoreConditionInput
) {
  deleteGameScore(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGameScoreMutationVariables,
  APITypes.DeleteGameScoreMutation
>;
export const createGameHint = /* GraphQL */ `mutation CreateGameHint(
  $input: CreateGameHintInput!
  $condition: ModelGameHintConditionInput
) {
  createGameHint(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGameHintMutationVariables,
  APITypes.CreateGameHintMutation
>;
export const updateGameHint = /* GraphQL */ `mutation UpdateGameHint(
  $input: UpdateGameHintInput!
  $condition: ModelGameHintConditionInput
) {
  updateGameHint(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGameHintMutationVariables,
  APITypes.UpdateGameHintMutation
>;
export const deleteGameHint = /* GraphQL */ `mutation DeleteGameHint(
  $input: DeleteGameHintInput!
  $condition: ModelGameHintConditionInput
) {
  deleteGameHint(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGameHintMutationVariables,
  APITypes.DeleteGameHintMutation
>;
export const createGameClue = /* GraphQL */ `mutation CreateGameClue(
  $input: CreateGameClueInput!
  $condition: ModelGameClueConditionInput
) {
  createGameClue(input: $input, condition: $condition) {
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
}
` as GeneratedMutation<
  APITypes.CreateGameClueMutationVariables,
  APITypes.CreateGameClueMutation
>;
export const updateGameClue = /* GraphQL */ `mutation UpdateGameClue(
  $input: UpdateGameClueInput!
  $condition: ModelGameClueConditionInput
) {
  updateGameClue(input: $input, condition: $condition) {
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
}
` as GeneratedMutation<
  APITypes.UpdateGameClueMutationVariables,
  APITypes.UpdateGameClueMutation
>;
export const deleteGameClue = /* GraphQL */ `mutation DeleteGameClue(
  $input: DeleteGameClueInput!
  $condition: ModelGameClueConditionInput
) {
  deleteGameClue(input: $input, condition: $condition) {
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
}
` as GeneratedMutation<
  APITypes.DeleteGameClueMutationVariables,
  APITypes.DeleteGameClueMutation
>;
export const createGamePlayZone = /* GraphQL */ `mutation CreateGamePlayZone(
  $input: CreateGamePlayZoneInput!
  $condition: ModelGamePlayZoneConditionInput
) {
  createGamePlayZone(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGamePlayZoneMutationVariables,
  APITypes.CreateGamePlayZoneMutation
>;
export const updateGamePlayZone = /* GraphQL */ `mutation UpdateGamePlayZone(
  $input: UpdateGamePlayZoneInput!
  $condition: ModelGamePlayZoneConditionInput
) {
  updateGamePlayZone(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGamePlayZoneMutationVariables,
  APITypes.UpdateGamePlayZoneMutation
>;
export const deleteGamePlayZone = /* GraphQL */ `mutation DeleteGamePlayZone(
  $input: DeleteGamePlayZoneInput!
  $condition: ModelGamePlayZoneConditionInput
) {
  deleteGamePlayZone(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGamePlayZoneMutationVariables,
  APITypes.DeleteGamePlayZoneMutation
>;
export const createUserGamePlay = /* GraphQL */ `mutation CreateUserGamePlay(
  $input: CreateUserGamePlayInput!
  $condition: ModelUserGamePlayConditionInput
) {
  createUserGamePlay(input: $input, condition: $condition) {
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
      gameLocationPlaceDetails
      gameLocationCity
      gameDesigner
      gameLevel
      walkingDistance
      playZones
      gameImage
      gameType
      gameWinMessage
      gameWinImage
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
` as GeneratedMutation<
  APITypes.CreateUserGamePlayMutationVariables,
  APITypes.CreateUserGamePlayMutation
>;
export const updateUserGamePlay = /* GraphQL */ `mutation UpdateUserGamePlay(
  $input: UpdateUserGamePlayInput!
  $condition: ModelUserGamePlayConditionInput
) {
  updateUserGamePlay(input: $input, condition: $condition) {
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
      gameLocationPlaceDetails
      gameLocationCity
      gameDesigner
      gameLevel
      walkingDistance
      playZones
      gameImage
      gameType
      gameWinMessage
      gameWinImage
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
` as GeneratedMutation<
  APITypes.UpdateUserGamePlayMutationVariables,
  APITypes.UpdateUserGamePlayMutation
>;
export const deleteUserGamePlay = /* GraphQL */ `mutation DeleteUserGamePlay(
  $input: DeleteUserGamePlayInput!
  $condition: ModelUserGamePlayConditionInput
) {
  deleteUserGamePlay(input: $input, condition: $condition) {
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
      gameLocationPlaceDetails
      gameLocationCity
      gameDesigner
      gameLevel
      walkingDistance
      playZones
      gameImage
      gameType
      gameWinMessage
      gameWinImage
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
` as GeneratedMutation<
  APITypes.DeleteUserGamePlayMutationVariables,
  APITypes.DeleteUserGamePlayMutation
>;
