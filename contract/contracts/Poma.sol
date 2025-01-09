// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Poma {
    //Participant struct to store participant details
    struct Participant {
        address userAddress;
        uint points;
        bool paid1;
        bool paid2;
    }
    event ActivityCreated(
        uint activityId,
        uint gameId,
        uint winningPoints1,
        uint winningPoints2,
        string gameName,
        uint reward1,
        uint reward2
    );

    //Activity struct to store tournament details
    struct Activity {
        uint gameId;
        uint winningPoints1;
        uint winningPoints2;
        uint activityId;
        string gameName;
        uint reward1;
        uint reward2;
        uint numParticipants;
        mapping(uint => Participant) participants;
    }
    uint numActivities;
    mapping(uint => Activity) public activities;

    receive() external payable {}

    /**
     *
     * @param _gameId - Id of the game
     * @param _winningPoints1 - First milestone to be rewarded
     * @param _winningPoints2 - Second milestone to be rewarded
     * @param _gameName - Name of the game
     * @param _reward1 - Reward for the first milestone
     * @param _reward2 - Reward for the second milestone
     * @return activityId - Id of the activity
     */
    function createActivity(
        uint _gameId,
        uint _winningPoints1,
        uint _winningPoints2,
        string memory _gameName,
        uint _reward1,
        uint _reward2
    ) public returns (uint activityId) {
        activityId = numActivities++;
        Activity storage activity = activities[activityId];
        activity.gameId = _gameId;
        activity.winningPoints1 = _winningPoints1;
        activity.winningPoints2 = _winningPoints2;

        activity.gameName = _gameName;
        activity.reward1 = _reward1;
        activity.reward2 = _reward2;
        emit ActivityCreated(
            activityId,
            _gameId,
            _winningPoints1,
            _winningPoints2,
            _gameName,
            _reward1,
            _reward2
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
            paid1: false,
            paid2: false
        });
    }

    /**
     *
     * @param userAddress  - Address of the participant
     * @param reward  - Reward for the winner
     * @param activityId  - Id of the activity
     * @param index  - Index of the participant
     * @param milestone - Milestone to mark as paid
     */
    function sendReward(
        address userAddress,
        uint reward,
        uint activityId,
        uint index,
        uint milestone
    ) internal {
        if (
            activities[activityId].participants[index].userAddress ==
            userAddress
        ) {
            rewardWinner(payable(userAddress), reward);
            if (milestone == 1)
                activities[activityId].participants[index].paid1 = true;
            else if (milestone == 2)
                activities[activityId].participants[index].paid2 = true;
            else if (milestone == 12) {
                activities[activityId].participants[index].paid1 = true;
                activities[activityId].participants[index].paid2 = true;
            } else return;
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
        Activity storage activity = activities[_activityId];

        for (uint i = 0; i < activity.numParticipants; i++) {
            if (activity.participants[i].userAddress == _userAddress) {
                activity.participants[i].points += _points;
                //Check if the participant has won
                uint result = hasWon(
                    _userAddress,
                    _activityId,
                    activity.winningPoints1,
                    activity.winningPoints2,
                    i
                );
                if (result == 0) {
                    return;
                } else if (result == 1) {
                    sendReward(
                        _userAddress,
                        activity.reward1,
                        _activityId,
                        i,
                        1
                    );
                    return;
                } else if (result == 2) {
                    sendReward(
                        _userAddress,
                        activity.reward2,
                        _activityId,
                        i,
                        2
                    );
                    return;
                } else if (result == 12) {
                    sendReward(
                        _userAddress,
                        (activity.reward1 + activity.reward2),
                        _activityId,
                        i,
                        12
                    );
                    return;
                } else {
                    return;
                }
            }
        }
    }

    /**
     * @param userAdress  - Address of the participant
     * @param activityId  - The id of the activity
     * @param winningPoints1  - First milestone to be rewarded
     * @param winningPoints2  - Second milestone to be rewarded
     * @param userIndex - The index of the user in the array
     */
    function hasWon(
        address userAdress,
        uint activityId,
        uint winningPoints1,
        uint winningPoints2,
        uint userIndex
    ) internal view returns (uint) {
        if (
            activities[activityId].participants[userIndex].userAddress ==
            userAdress
        ) {
            if (
                activities[activityId].participants[userIndex].paid1 == true &&
                activities[activityId].participants[userIndex].paid2 == true
            ) {
                return 0;
            } else if (
                activities[activityId].participants[userIndex].paid1 == true &&
                activities[activityId].participants[userIndex].paid2 == false
            ) {
                if (
                    activities[activityId].participants[userIndex].points >=
                    winningPoints2
                ) {
                    return 2;
                }
            } else if (
                activities[activityId].participants[userIndex].paid1 == false &&
                activities[activityId].participants[userIndex].paid2 == false
            ) {
                if (
                    activities[activityId].participants[userIndex].points >=
                    winningPoints2
                ) {
                    return 12;
                }

                if (
                    activities[activityId].participants[userIndex].points >=
                    winningPoints1
                ) {
                    return 1;
                }
            }
        }
        return 0;
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
