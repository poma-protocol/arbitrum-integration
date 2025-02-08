// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Poma {
    //Participant struct to store participant details
    struct Participant {
        address userAddress;
        uint points;
        bool paid;
    }
    event ActivityCreated(
        uint activityId,
        uint gameId,
        uint winningPoints,
        string gameName,
        uint reward
    );

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

    receive() external payable {}

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
        emit ActivityCreated(
            activityId,
            _gameId,
            _winningPoints,
            _gameName,
            _reward
        );
        return activityId;
    }

    function getNumberOfActivities() public view returns (uint) {
        return numActivities;
    }

    function getTotalParticipants(uint _activityId) public view returns (uint) {
        return activities[_activityId].numParticipants;
    }

    function getMyPoints(
        uint _activityId,
        address _userAddress
    ) public view returns (uint) {
        for (uint i = 0; i < activities[_activityId].numParticipants; i++) {
            if (
                activities[_activityId].participants[i].userAddress ==
                _userAddress
            ) {
                return activities[_activityId].participants[i].points;
            }
        }
        return 0;
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
            points: 0,
            paid: false
        });
    }
}
