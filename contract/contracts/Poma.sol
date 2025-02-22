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
     * @return id - Id of the activity
     */
    function createActivity(
        uint activityId,
        uint _gameId,
        uint _winningPoints,
        string memory _gameName,
        uint _reward
    ) public returns (uint id) {
        id = numActivities++;
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
                //Check if the participant has won
                if (hasWon(_userAddress, _activityId, i, activity.winningPoints)) {
                    sendReward(_userAddress, activity.reward, _activityId, i);
                }
            }
        }
    }

    /**
     * @param userAdress  - Address of the participant
     * @param activityId  - Id of the activity
     * @param index  - Index of the participant
     * @param totalPoints  - Total points of the participant
     */
    function hasWon(
        address userAdress,
        uint activityId,
        uint index,
        uint totalPoints
    ) internal view returns (bool) {
        Activity storage activity = activities[activityId];
        if (activity.participants[index].userAddress == userAdress) {
            if (activity.participants[index].points >= totalPoints) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param userAddress  - Address of the participant
     * @param reward  - Reward for the winner
     * @param activityId  - Id of the activity
     * @param index  - Index of the participant
     */
    function sendReward(
        address userAddress,
        uint reward,
        uint activityId,
        uint index
    ) internal {
        Activity storage activity = activities[activityId];
        if (
            activity.participants[index].userAddress ==
            userAddress
        ) {
            if (activity.participants[index].paid == true) {
                return;
            }
            rewardWinner(payable(userAddress), reward);
            activity.participants[index].paid = true;
        }
    }

    function rewardWinner(
        address payable winner,
        uint256 rewardAmount
    ) internal {
        require(
            address(this).balance >= rewardAmount,
            "Not enough ETH in contract"
        );
        (bool success, ) = winner.call{value: rewardAmount}("");
        require(success, "Transfer failed");
    }
}
