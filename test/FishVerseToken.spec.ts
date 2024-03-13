import {ethers} from "hardhat";
import {expect} from "chai";
import {testVesting} from "./utilities"
import { reset } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("FishVerseToken", function () {
    before(async function () {
        this.FishVerseToken = await ethers.getContractFactory("FishVerseToken")
        this.signers = await ethers.getSigners()
        this.owner = this.signers[0]
        this.bob = this.signers[1]
        this.carol = this.signers[2]
    })

    beforeEach(async function () {
        await reset()

        this.token = await this.FishVerseToken.deploy()
        this.saleEnd = await this.token.dateSaleEnd()
        this.latestBlock = await ethers.provider.getBlock("latest")
        this.teamTokens = await this.token.teamTokens()
        this.advisorsTokens = await this.token.advisorsTokens()
        this.foundationTokens = await this.token.foundationTokens()
        this.tokenHoldersTokens = await this.token.tokenHoldersTokens()
        this.ecosystemTokens = await this.token.ecosystemTokens()
        this.lockedTokens = this.teamTokens + this.advisorsTokens + this.foundationTokens + this.tokenHoldersTokens + this.ecosystemTokens
        this.premintedSeedTokens = await this.token.seedTokens()
        this.premintedPrivateSaleTokens = await this.token.privateSaleTokens()
        this.premintedPublicSaleTokens = await this.token.publicSaleTokens()
        this.premintedLiquidityTokens = await this.token.liquidityTokens()
        this.premintedTokens = this.premintedSeedTokens + this.premintedPrivateSaleTokens + this.premintedPublicSaleTokens + this.premintedLiquidityTokens
    })

    it("should have correct name and symbol and decimal", async function () {
        const name = await this.token.name()
        const symbol = await this.token.symbol()
        const decimals = await this.token.decimals()
        expect(name).to.equal("FishVerse")
        expect(symbol).to.equal("FVS")
        expect(decimals).to.equal(18)
    })

    it("should have initial supply of private sale tokens", async function () {
        const totalSupply = await this.token.totalSupply()
        expect(totalSupply).to.equal(this.lockedTokens + this.premintedTokens)
        const ownerBalance = await this.token.balanceOf(this.owner.address)
        expect(ownerBalance).to.equal(this.premintedTokens)
    })

    it("should supply token transfers properly", async function () {
        await this.token.connect(this.owner).transfer(this.carol.address, "100", {
            from: this.owner.address,
        })
        const ownerBal = await this.token.balanceOf(this.owner.address)
        const bobBal = await this.token.balanceOf(this.bob.address)
        const carolBal = await this.token.balanceOf(this.carol.address)

        expect(ownerBal).to.equal(this.premintedTokens - BigInt(100))
        expect(bobBal).to.equal(0)
        expect(carolBal).to.equal(100)
    })

    it("should give out tokens advisor tokens only after time", async function () {
        try{
            const walletAddress = await this.token.advisorsVestingWallet()
            await testVesting(this, walletAddress, this.advisorsTokens, 0, 51, "Advisors")
        } catch (err) {
            console.error(err);
            throw err;
        }
    })

    it("should give out tokens team tokens only after time", async function () {
        try{
            const walletAddress = await this.token.teamVestingWallet()
            await testVesting(this, walletAddress, this.teamTokens, 0, 51, "Team")
        } catch (err) {
            console.error(err);
            throw err;
        }
    })

    it("should give out tokens foundation tokens only after time", async function () {
        try{
            const walletAddress = await this.token.foundationVestingWallet()
            await testVesting(this, walletAddress, this.foundationTokens, 0, 51, "Foundation")
        } catch (err) {
            console.error(err);
            throw err;
        }
    })

    it("should give out tokens token holders tokens only after time", async function () {
        try{
            const walletAddress = await this.token.tokenHoldersVestingWallet()
            await testVesting(this, walletAddress, this.tokenHoldersTokens, 0, 56, "Token Holders")
        } catch (err) {
            console.error(err);
            throw err;
        }
    })    
    
    it("should give out tokens token holders tokens only after time", async function () {
        try{
            const walletAddress = await this.token.ecosystemVestingWallet()
            await testVesting(this, walletAddress, this.ecosystemTokens, 1, 61, "Ecosystem")
        } catch (err) {
            console.error(err);
            throw err;
        }
    })
})
