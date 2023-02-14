// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error View__NotEnoughETHView();
error View_NotNeedUpdate();

contract Random is VRFConsumerBaseV2 {
    uint256 private immutable i_viewFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint256[] numbers;
    uint32 private constant NUM_WORDS = 1;

    event ViewFee(address indexed costumer);
    event RequestViewSupplyChain(uint256 indexed requestId);
    event NumbersPicked();

    constructor(
        address vrfCoordinatorV2,
        uint256 viewFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_viewFee = viewFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        numbers = new uint256[](NUM_WORDS);
        numbers[0] =
            uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) %
            1000;
    }

    function viewSupplyChain() public payable {
        if (msg.value < i_viewFee) {
            revert View__NotEnoughETHView();
        }
        emit ViewFee(msg.sender);
    }

    function requestRandomNumbers() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestViewSupplyChain(requestId);
    }

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] memory /*randomWords*/
    ) internal override {
        emit NumbersPicked();
    }

    function getViewFee() public view returns (uint256) {
        return i_viewFee;
    }

    /*function getRandomNumbers() public pure returns (uint256[] memory) {
        uint256[] memory numbers = new uint256[](NUM_WORDS);
        numbers[0] = s_number1;
        numbers[1] = s_number2;
        numbers[2] = s_number3;
        numbers[3] = s_number4;
        numbers[4] = s_number5;
        getNum1();
        return numbers;
    }*/

    function getNumWords() public pure returns (uint256) {
        //SgetNum1();
        return NUM_WORDS;
    }

    function getNum() public view returns (uint256) {
        return numbers[0];
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
