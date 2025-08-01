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
        bool isActive;
        address creator;
        uint maxParticipants;
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
     * @param creator - Address of the creator of the activity
     * @param maxParticipants - Maximum number of participants
     * @return id - Id of the activity
     */
    function createActivity(
        uint activityId,
        uint _gameId,
        uint _winningPoints,
        string memory _gameName,
        uint _reward,
        address creator,
        uint maxParticipants
    ) public returns (uint id) {
        id = numActivities++;
        Activity storage activity = activities[activityId];
        activity.activityId = activityId;
        activity.gameId = _gameId;
        activity.winningPoints = _winningPoints;
        activity.gameName = _gameName;
        activity.reward = _reward;
        activity.isActive = true;
        activity.creator = creator;
        activity.maxParticipants = maxParticipants;
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
     * @param activityId - Id of the activity
     * @param _userAddress - Address of the participant
     */
    function addParticipant(uint activityId, address _userAddress) public {
        for (uint i = 0; i <= numActivities; i++) {
            if (activities[i].activityId == activityId) {
                Activity storage activity = activities[i];
                activity.participants[
                    activity.numParticipants++
                ] = Participant({
                    userAddress: _userAddress,
                    points: 0,
                    paid: false
                });
            }
        }
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
        for (uint i = 0; i <= numActivities; i++) {
            if (activities[i].activityId == _activityId) {
                Activity storage activity = activities[i];
                for (uint j = 0; j < activity.numParticipants; j++) {
                    if (activity.participants[j].userAddress == _userAddress) {
                        activity.participants[j].points += _points;
                        //Check if the participant has won
                        if (
                            hasWon(_userAddress, i, j, activity.winningPoints)
                        ) {
                            sendReward(_userAddress, activity.reward, i, j);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param userAdress  - Address of the participant
     * @param activityIndex  - Index of the activity
     * @param index  - Index of the participant
     * @param totalPoints  - Total points of the participant
     */
    function hasWon(
        address userAdress,
        uint activityIndex,
        uint index,
        uint totalPoints
    ) internal view returns (bool) {
        Activity storage activity = activities[activityIndex];
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
     * @param activityIndex  - Index of the activity
     * @param index  - Index of the participant
     */
    function sendReward(
        address userAddress,
        uint reward,
        uint activityIndex,
        uint index
    ) internal {
        Activity storage activity = activities[activityIndex];
        if (activity.participants[index].userAddress == userAddress) {
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

    function endActivity(
        uint256 _id
    ) external {
        Activity storage activity = activities[_id];
        require(activity.activityId == _id, "Activity does not exist");
        uint256 totalDistributed = activity.reward * activity.numParticipants;
        uint256 remaining = (activity.reward * activity.maxParticipants) -
            totalDistributed;
        if (remaining > 0) {
            (bool success, ) = activity.creator.call{value: remaining}("");
            require(success, "Refund transfer failed");
        }
        activity.isActive = false;
    }
    function getActivityStatus(
        uint256 _activityId
    ) external view returns (bool) {
        return activities[_activityId].isActive;
    }
}
