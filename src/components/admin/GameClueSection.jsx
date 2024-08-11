import {Button, Flex, Heading, TextField, View, SwitchField, TextAreaField, Input, Image} from "@aws-amplify/ui-react";
import React, {useEffect, useState} from "react";
import * as backups from "../../backups/backups";
import * as mutations from "../../graphql/mutations";
import {getGameClue, getGameHint, getGamePlayZone, getGamePuzzle, getTextField, listGames} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";

export default function GameClueSection(props) {
}