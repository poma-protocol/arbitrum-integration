// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Poma {
    //Participant struct to store participant details
    struct Participant {
        address userAddress;
        uint points;
    }

    //Activity struct to store tournament details
    struct Activity {
        uint gameId;
        uint winningPoints;
        uint activityId;
        string gameName;
        uint reward;
        mapping(uint => Participant) participants;
    }
    uint numActivities;
    mapping(uint => Activity) public activities;

    //Functionalities to implement
    //1. Add a new activity
    //2. Add a new participant to an activity
    //3. Update the points of a participant
    //4. Get the points of a participant
    //5. Determine the winner of an activity
    //6. Send reward to the winner of an activity

    /**
     *
     * @param _gameId - Id of the game
     * @param _winningPoints - Points required to win the game
     * @param _gameName - Name of the game
     * @param _reward - Reward for the winner
     */
    function createActivity(
        uint _gameId,
        uint _winningPoints,
        string memory _gameName,
        uint _reward
    ) public {
        uint activityId = numActivities++;
        Activity storage activity = activities[activityId];
        activity.gameId = _gameId;
        activity.winningPoints = _winningPoints;
        activity.gameName = _gameName;
        activity.reward = _reward;
    }
}
