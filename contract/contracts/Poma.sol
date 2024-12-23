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
        uint numParticipants;
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
     * @return activityId - Id of the activity
     */
    function createActivity(
        uint _gameId,
        uint _winningPoints,
        string memory _gameName,
        uint _reward
    ) public returns (uint activityId) {
        activityId = numActivities++;
        Activity storage activity = activities[activityId];
        activity.gameId = _gameId;
        activity.winningPoints = _winningPoints;
        activity.gameName = _gameName;
        activity.reward = _reward;
    }

    /**
     *
     * @param _activityId - Id of the activity
     * @param _userAddress - Address of the participant
     */
    function addParticipant(uint _activityId, address _userAddress) public {
        Activity storage activity = activities[_activityId];
        activity.participants[activity.numParticipants++] = Participant({
            userAddress: _userAddress,
            points: 0
        });
    }

    /**
     *
     * @param _activityId  - Id of the activity
     * @param _userAddress  - Address of the participant
     * @param _points - Points to be updated
     */
    function updatePoints(
        uint _activityId,
        address _userAddress,
        uint _points
    ) public {
        Activity storage activity = activities[_activityId];
        for (uint i = 0; i < activity.numParticipants; i++) {
            if (activity.participants[i].userAddress == _userAddress) {
                activity.participants[i].points += _points;
            }
        }
    }

    /**
     * @param userAdress  - Address of the participant
     * @param index  - Index of the participant
     * @param totalPoints  - Total points of the participant
     */
    function hasWon(
        address userAdress,
        uint index,
        uint totalPoints
    ) internal (bool hasWon) {
        if (activities[index].participants[index].userAddress == userAdress) {
            if (activities[index].participants[index].points >= totalPoints) {
                return true;
            }
        }
        return false;
    }
}
