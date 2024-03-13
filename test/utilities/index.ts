import {ethers} from "hardhat"
import {expect} from "chai";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

export const ONE_YEAR = BigInt(31556926);
export const ONE_MONTH = ONE_YEAR/BigInt(12);
export const ONE_WEEK = ONE_MONTH/BigInt(4);
export const ONE_DAY = ONE_WEEK/BigInt(7);

export async function testVesting(self: any, walletAddress: any, budget: any, initial: any = 0, length: any, name: any) {
    const MonthlyVestingWallet = await ethers.getContractFactory("MonthlyVestingWallet")
    const wallet = await MonthlyVestingWallet.attach(walletAddress);
    expect(await self.token.balanceOf(walletAddress)).to.equal(budget)
    expect(await self.token.balanceOf(self.owner.address)).to.equal(self.premintedTokens)
    expect(await wallet.beneficiary()).to.equal(self.owner.address)

    await time.increaseTo(self.saleEnd - ONE_MONTH + BigInt(1000))
    for (let i = -1; i <= length; i++) {
        self.latestBlock = await ethers.provider.getBlock("latest")
        let a = new Date(self.latestBlock.timestamp * 1000);
        let val = 0;

        await wallet.vestedAmountToken(self.token.target, self.latestBlock.timestamp).then((value: any) => {
            val = value.toString()
        });
        await wallet.releaseToken(self.token.target)
        console.log(name, (val / Number(budget)).toFixed(2), "Month #", i,a)
        await time.increase(ONE_MONTH)
    }

    await wallet.releaseToken(self.token.target)
    expect(await self.token.balanceOf(self.owner.address)).to.equal(budget + self.premintedTokens)

    self.latestBlock = await ethers.provider.getBlock("latest")
    let a = new Date(self.latestBlock.timestamp * 1000);

    console.log(name, "1.00", "Month #", length+1, a)
}

