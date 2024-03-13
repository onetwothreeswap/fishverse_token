// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MonthlyVestingWallet.sol";


contract FishVerseToken is ERC20, Ownable {

    constructor() ERC20("FishVerse", "FVS") Ownable(msg.sender)  {
        _mint(owner(), seedTokens);
        _mint(owner(), privateSaleTokens);
        _mint(owner(), publicSaleTokens);
        _mint(owner(), liquidityTokens);
        generateLockedTokens();
    }

    // Tue Aug 13 2024 09:00:00 GMT+0000
    uint256 public constant dateSaleEnd = 1723539600;
    
    /// Seed Sale 12.69%
    uint256 constant public seedTokens = 50000000000000000000000000;

    /// Public Sale 12.69%
    uint256 constant public privateSaleTokens = 50000000000000000000000000;

    /// Public Sale 12.69%
    uint256 constant public publicSaleTokens = 50000000000000000000000000;

    // Liquidity 10.15%
    uint256 constant public liquidityTokens = 40000000000000000000000000;

    // Team 5.84%
    uint256 constant public teamTokens = 23000000000000000000000000;

    // Advisors 2.54%
    uint256 constant public advisorsTokens = 10000000000000000000000000;

    // Foundation 1.52%
    uint256 constant public foundationTokens = 6000000000000000000000000;

    // Token Holders 2.54%
    uint256 constant public tokenHoldersTokens = 10000000000000000000000000;

    // Ecosystem 39.34%
    uint256 constant public ecosystemTokens = 155000000000000000000000000;


    address public teamVestingWallet;
    address public advisorsVestingWallet;
    address public foundationVestingWallet;
    address public tokenHoldersVestingWallet;
    address public ecosystemVestingWallet;

    uint64[] public teamSchedule =          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10];
    uint64[] public advisorsSchedule =      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10];
    uint64[] public foundationSchedule =    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10];
    uint64[] public tokenHoldersSchedule =  [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    uint64[] public ecosystemSchedule =     [0, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 4];

    uint64 constant internal SECONDS_PER_MONTH = 2629743; 

    function generateLockedTokens() internal {
        generateTeamTokens();
        generateAdvisorsTokens();
        generateFoundationTokens();
        generateTokenHoldersTokens();
        generateEcosystemTokens();
    }

    function generateTeamTokens() internal{
        MonthlyVestingWallet lockedTokens = new MonthlyVestingWallet(owner(), uint64(dateSaleEnd), 0, teamSchedule, SECONDS_PER_MONTH);
        teamVestingWallet = address(lockedTokens);
        _mint(teamVestingWallet, teamTokens);
    }   

    function generateAdvisorsTokens() internal{
        MonthlyVestingWallet lockedTokens = new MonthlyVestingWallet(owner(), uint64(dateSaleEnd), 0, advisorsSchedule, SECONDS_PER_MONTH);
        advisorsVestingWallet = address(lockedTokens);
        _mint(advisorsVestingWallet, advisorsTokens);
    }    

    function generateFoundationTokens() internal{
        MonthlyVestingWallet lockedTokens = new MonthlyVestingWallet(owner(), uint64(dateSaleEnd), 0, foundationSchedule, SECONDS_PER_MONTH);
        foundationVestingWallet = address(lockedTokens);
        _mint(foundationVestingWallet, foundationTokens);
    }

    function generateTokenHoldersTokens() internal{
        MonthlyVestingWallet lockedTokens = new MonthlyVestingWallet(owner(), uint64(dateSaleEnd), 0, tokenHoldersSchedule, SECONDS_PER_MONTH);
        tokenHoldersVestingWallet = address(lockedTokens);
        _mint(tokenHoldersVestingWallet, tokenHoldersTokens);
    }    
    
    function generateEcosystemTokens() internal{
        MonthlyVestingWallet lockedTokens = new MonthlyVestingWallet(owner(), uint64(dateSaleEnd), 1, ecosystemSchedule, SECONDS_PER_MONTH);
        ecosystemVestingWallet = address(lockedTokens);
        _mint(ecosystemVestingWallet, ecosystemTokens);
    }
}