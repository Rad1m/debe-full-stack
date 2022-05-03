// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

// Functionality:
// Stake
// Unstake
// Winners

contract Lottery is Ownable {

    using SafeERC20 for IERC20;

    // we need to know what is address of token for rewards and thats why we create constructor
    IERC20 public debeToken;
    constructor(address _debeTokenAddress) public {
        debeToken = IERC20(_debeTokenAddress);
    }

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }

    LOTTERY_STATE public lottery_state;

    enum GAME_STATE {
        OPEN,
        RUNNING,
        CLOSED,
        FINISHED,
        CANCELLED,
        POSTPONED
    }

    GAME_STATE public game_state;

    struct GameStruct {
        uint gameId;
        string gameName;
        string stadium;
        string homeTeam;
        string awayTeam;
        string winner;
        string result;
        GAME_STATE state;
        uint totalAmountStaked;
    }

    struct PlayersStruct {
        uint8 gameId;
        uint stakedAmount;
        string betOnTeam;
        bool winner;
        bool rewarded;
        uint blockNumber;
    }
    // mapping players to know stake amount and what they bet on
    mapping(address => mapping(address => uint)) public stakingBalance; // test if this is really needed
    mapping(address => PlayersStruct) public balances;
    mapping(uint8 => GameStruct) public games;
    
    address payable[] public playerList; // list of all players
    address payable[] public winnerList; // list of winners
    uint256 public winPool; // prize for winners
    uint256 public totalValueLocked; // total valu elocked for all stakes and tokens
    
    // to save on contract cost, all games will be in one contract
    // this function creates a game
    function createGame(uint8 _gameID, string memory _gameName, string memory _stadium, string memory _homeTeam, string memory _awayTeam, string memory _winner,string memory _result, GAME_STATE _state, uint _amount )  public payable onlyOwner {
        games[_gameID].gameId = _gameID;
        games[_gameID].gameName = _gameName;
        games[_gameID].stadium = _stadium;
        games[_gameID].homeTeam = _homeTeam;
        games[_gameID].awayTeam = _awayTeam;
        games[_gameID].winner = _winner;
        games[_gameID].result = _result;
        games[_gameID].state = _state;
        games[_gameID].totalAmountStaked += _amount;
    }

    function getGameStatus(uint8 _gameID) public view returns(GAME_STATE state, uint amount){
        return (games[_gameID].state, games[_gameID].totalAmountStaked);
    }

    function updateGame(uint8 _gameID, string memory _winner,string memory _result, GAME_STATE _state) public onlyOwner {
        games[_gameID].winner = _winner;
        games[_gameID].result = _result;
        games[_gameID].state = _state;
    }

   // staking tokens means entering the lottery, user can unstake their tokens for as long as the match has not started yet
   // I know the token address because it is my token
   function enterLottery(uint8 _gameID, string memory _betOnTeam, address _token, uint _amount) public payable {
       require(lottery_state == LOTTERY_STATE.OPEN);
       require(_amount > 0, "Amount must be more than 0");
       // require(tokenIsAllowed(_token), "Token is currently not allowed");
       require(bytes(_betOnTeam).length >= 1, "No winner has been selected");

       address staker = msg.sender;
       uint amount = _amount;

       // get fee for the team
       uint fee = getEntranceFee(amount);
       uint stakeAmount = amount - fee;

       // add player to the array
       playerList.push(payable(staker));
       stakingBalance[_token][staker] = stakingBalance[_token][staker] + stakeAmount;

       // add player to the struct
       balances[staker].gameId = _gameID;
       balances[staker].stakedAmount += stakeAmount;
       balances[staker].betOnTeam = _betOnTeam;
       balances[staker].blockNumber = block.number;
       balances[staker].winner = false;
       balances[staker].rewarded = false;
       games[_gameID].totalAmountStaked += stakeAmount;

       // update total value locked
       totalValueLocked += stakeAmount;

       // prevent rentrancy attack by having transfer at the end
       debeToken.safeTransferFrom( staker, 0x5a8a9CffB9d17879D0E2c0E8CE19df43B15956F1, fee);
       debeToken.safeTransferFrom(staker, address(this), stakeAmount);
       console.log("Staked balance is", balances[staker].stakedAmount);
       console.log("Staked balance2 is", stakingBalance[_token][staker]);
   }

    // this allows player to reduce his stake or exit completely
   function updateStakeBeforeStart(uint8 gameID,address _token, uint _amount) public payable{
        console.log("Total value locked before", totalValueLocked);
        require(lottery_state == LOTTERY_STATE.OPEN);
        address staker = msg.sender;
        require(balances[staker].stakedAmount >= _amount, "You try to unstake too much");
        uint amount = _amount;
        balances[staker].stakedAmount -= amount;
        games[gameID].totalAmountStaked -= amount;
        totalValueLocked -= amount;
        // prevent reentrancy attack by having transaction at the end
        debeToken.safeTransfer(staker, amount);
        console.log("Total value locked after", totalValueLocked);
   }

   function claimAll(uint8 gameID, address _token) public payable {
       require(games[gameID].state == GAME_STATE.CANCELLED, "Game MUST be cancelled");
       address staker = msg.sender;
       uint amount = balances[staker].stakedAmount;
       console.log("Transfer is", amount);
       balances[staker].stakedAmount -= amount;
       games[gameID].totalAmountStaked -= amount;
       totalValueLocked -= amount;
       // prevent reentrancy attack by having transaction at the end
       debeToken.safeTransfer(staker, amount);
   }


   function claimRewards(uint8 gameID,address _token) public payable{
       address staker = msg.sender;
       require(lottery_state == LOTTERY_STATE.CLOSED, "Lottery is not closed");
       require(balances[staker].winner == true, "You are not a winner");
       require(balances[staker].rewarded == false, "You have claimed the rewards already");
       balances[staker].rewarded = true;
       // prevent reentrancy attack by having transaction at the end
       debeToken.safeTransfer(staker, calculatePrize());
   }

   function getEntranceFee(uint256 _betAmount) public pure returns(uint entryFee){
       // do some rules to enter here
       uint minimumBet = 50;
       require(_betAmount >= minimumBet, "Minimum bet not reached");
       return entryFee = _betAmount * 5 / 100; // 5%
   }

   function startLottery() public onlyOwner {
        require(
            lottery_state == LOTTERY_STATE.CLOSED,
            "Can't start a new lottery yet!"
        );
        lottery_state = LOTTERY_STATE.OPEN;
    }

   function endLottery() public onlyOwner {
       lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
   }

   function closeLottery() public onlyOwner {
       lottery_state = LOTTERY_STATE.CLOSED;
       game_state = GAME_STATE.CLOSED;
   }

   // this will be run every time a user will claim their reward
   function calculatePrize() public view returns(uint256 winAmount){
       // get player's address
       address staker = msg.sender;

        // The number of winners will be less or equal to number of players
        // the winners will share the prize among themselves
        // players who didn't win will lose their stake
        // the IF condirions are used to save on gas
       if (winnerList.length == 1){
           winAmount = totalValueLocked; // only one winner ==> gets entire pool
       } else if (winnerList.length > 1){
           // players with higher bets will get higher (weighted) rewards
           uint weight = balances[staker].stakedAmount * 10000 /winPool;
           winAmount = ((totalValueLocked - winPool) * weight)/10000;
           winAmount = winAmount + balances[staker].stakedAmount;
       }
       else {
           // if nobody has won, then there is no rewards
           winAmount = 0;
       }
       return winAmount;
   }

    // get how much money user staked
    function getUserTVL(address _user) public view returns(uint){
        uint totalValue = 0;
        totalValue = balances[_user].stakedAmount;
        return totalValue;
    }

    // check how many winners we have
    // winners wil split the prize among themnselves
   function getWinners(string memory _result) public onlyOwner {
       // iterate through players and add winners to array
       // this is gas expensive
       require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "Lottery needs to finish first");
       for (uint i=0; i<playerList.length; i++) {

           // compare strings
           if(keccak256(abi.encodePacked(balances[playerList[i]].betOnTeam)) == keccak256(abi.encodePacked(_result)))
           {
               balances[playerList[i]].winner = true;
               winnerList.push(payable(playerList[i]));
           } else {
               balances[playerList[i]].winner = false;
           }
        }
        getWinPool(); // get much staked there is among winners
   }

   function getWinPool () public onlyOwner {
       require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "Lottery needs to finish first");
       for (uint i=0; i<winnerList.length; i++) {
            winPool += balances[winnerList[i]].stakedAmount;
        }
        closeLottery(); // close lottery, rewards can be paid out
   }
}