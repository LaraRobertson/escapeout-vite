/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateGame = /* GraphQL */ `subscription OnCreateGame($filter: ModelSubscriptionGameFilterInput) {
  onCreateGame(filter: $filter) {
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
    gamePuzzle
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
` as GeneratedSubscription<
  APITypes.OnCreateGameSubscriptionVariables,
  APITypes.OnCreateGameSubscription
>;
export const onUpdateGame = /* GraphQL */ `subscription OnUpdateGame($filter: ModelSubscriptionGameFilterInput) {
  onUpdateGame(filter: $filter) {
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
    gamePuzzle
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
` as GeneratedSubscription<
  APITypes.OnUpdateGameSubscriptionVariables,
  APITypes.OnUpdateGameSubscription
>;
export const onDeleteGame = /* GraphQL */ `subscription OnDeleteGame($filter: ModelSubscriptionGameFilterInput) {
  onDeleteGame(filter: $filter) {
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
    gamePuzzle
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
` as GeneratedSubscription<
  APITypes.OnDeleteGameSubscriptionVariables,
  APITypes.OnDeleteGameSubscription
>;
export const onCreateGameStats = /* GraphQL */ `subscription OnCreateGameStats($filter: ModelSubscriptionGameStatsFilterInput) {
  onCreateGameStats(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGameStatsSubscriptionVariables,
  APITypes.OnCreateGameStatsSubscription
>;
export const onUpdateGameStats = /* GraphQL */ `subscription OnUpdateGameStats($filter: ModelSubscriptionGameStatsFilterInput) {
  onUpdateGameStats(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGameStatsSubscriptionVariables,
  APITypes.OnUpdateGameStatsSubscription
>;
export const onDeleteGameStats = /* GraphQL */ `subscription OnDeleteGameStats($filter: ModelSubscriptionGameStatsFilterInput) {
  onDeleteGameStats(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGameStatsSubscriptionVariables,
  APITypes.OnDeleteGameStatsSubscription
>;
export const onCreateGameScore = /* GraphQL */ `subscription OnCreateGameScore($filter: ModelSubscriptionGameScoreFilterInput) {
  onCreateGameScore(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGameScoreSubscriptionVariables,
  APITypes.OnCreateGameScoreSubscription
>;
export const onUpdateGameScore = /* GraphQL */ `subscription OnUpdateGameScore($filter: ModelSubscriptionGameScoreFilterInput) {
  onUpdateGameScore(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGameScoreSubscriptionVariables,
  APITypes.OnUpdateGameScoreSubscription
>;
export const onDeleteGameScore = /* GraphQL */ `subscription OnDeleteGameScore($filter: ModelSubscriptionGameScoreFilterInput) {
  onDeleteGameScore(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGameScoreSubscriptionVariables,
  APITypes.OnDeleteGameScoreSubscription
>;
export const onCreateGameHint = /* GraphQL */ `subscription OnCreateGameHint($filter: ModelSubscriptionGameHintFilterInput) {
  onCreateGameHint(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGameHintSubscriptionVariables,
  APITypes.OnCreateGameHintSubscription
>;
export const onUpdateGameHint = /* GraphQL */ `subscription OnUpdateGameHint($filter: ModelSubscriptionGameHintFilterInput) {
  onUpdateGameHint(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGameHintSubscriptionVariables,
  APITypes.OnUpdateGameHintSubscription
>;
export const onDeleteGameHint = /* GraphQL */ `subscription OnDeleteGameHint($filter: ModelSubscriptionGameHintFilterInput) {
  onDeleteGameHint(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGameHintSubscriptionVariables,
  APITypes.OnDeleteGameHintSubscription
>;
export const onCreateGameClue = /* GraphQL */ `subscription OnCreateGameClue($filter: ModelSubscriptionGameClueFilterInput) {
  onCreateGameClue(filter: $filter) {
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
}
` as GeneratedSubscription<
  APITypes.OnCreateGameClueSubscriptionVariables,
  APITypes.OnCreateGameClueSubscription
>;
export const onUpdateGameClue = /* GraphQL */ `subscription OnUpdateGameClue($filter: ModelSubscriptionGameClueFilterInput) {
  onUpdateGameClue(filter: $filter) {
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
}
` as GeneratedSubscription<
  APITypes.OnUpdateGameClueSubscriptionVariables,
  APITypes.OnUpdateGameClueSubscription
>;
export const onDeleteGameClue = /* GraphQL */ `subscription OnDeleteGameClue($filter: ModelSubscriptionGameClueFilterInput) {
  onDeleteGameClue(filter: $filter) {
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
}
` as GeneratedSubscription<
  APITypes.OnDeleteGameClueSubscriptionVariables,
  APITypes.OnDeleteGameClueSubscription
>;
export const onCreateGamePlayZone = /* GraphQL */ `subscription OnCreateGamePlayZone(
  $filter: ModelSubscriptionGamePlayZoneFilterInput
) {
  onCreateGamePlayZone(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGamePlayZoneSubscriptionVariables,
  APITypes.OnCreateGamePlayZoneSubscription
>;
export const onUpdateGamePlayZone = /* GraphQL */ `subscription OnUpdateGamePlayZone(
  $filter: ModelSubscriptionGamePlayZoneFilterInput
) {
  onUpdateGamePlayZone(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGamePlayZoneSubscriptionVariables,
  APITypes.OnUpdateGamePlayZoneSubscription
>;
export const onDeleteGamePlayZone = /* GraphQL */ `subscription OnDeleteGamePlayZone(
  $filter: ModelSubscriptionGamePlayZoneFilterInput
) {
  onDeleteGamePlayZone(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGamePlayZoneSubscriptionVariables,
  APITypes.OnDeleteGamePlayZoneSubscription
>;
export const onCreateUserGamePlay = /* GraphQL */ `subscription OnCreateUserGamePlay(
  $filter: ModelSubscriptionUserGamePlayFilterInput
) {
  onCreateUserGamePlay(filter: $filter) {
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
      gamePuzzle
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
` as GeneratedSubscription<
  APITypes.OnCreateUserGamePlaySubscriptionVariables,
  APITypes.OnCreateUserGamePlaySubscription
>;
export const onUpdateUserGamePlay = /* GraphQL */ `subscription OnUpdateUserGamePlay(
  $filter: ModelSubscriptionUserGamePlayFilterInput
) {
  onUpdateUserGamePlay(filter: $filter) {
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
      gamePuzzle
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserGamePlaySubscriptionVariables,
  APITypes.OnUpdateUserGamePlaySubscription
>;
export const onDeleteUserGamePlay = /* GraphQL */ `subscription OnDeleteUserGamePlay(
  $filter: ModelSubscriptionUserGamePlayFilterInput
) {
  onDeleteUserGamePlay(filter: $filter) {
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
      gamePuzzle
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserGamePlaySubscriptionVariables,
  APITypes.OnDeleteUserGamePlaySubscription
>;
