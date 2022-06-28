import { ethers } from "hardhat";
import { assert } from "chai";
const axios = require('axios');
const schedule = require('node-schedule');
import { BigNumber } from "ethers";
const log4js = require('log4js')

const tradingRewardsContractAddress = "0x424ac152E54d93B4b76A9196eF1b9bFf277D2c5b"

async function main() {

    const accounts = await ethers.getSigners();
    let admin = accounts[0];

    let TradingRewardsContract = ethers.getContractFactory("TradingRewardsDistributor")
    let tradingRewards = (await TradingRewardsContract).attach(tradingRewardsContractAddress);


    let rule = new schedule.RecurrenceRule();
    // 每天下午6点
    // rule.hour = 18
    // rule.minuit = 0
    // rule.second = 0
    // rule.second = [0, 15, 30, 45];
    // rule.minute = 30
    rule.second = 0

    log4js.configure({
        appenders: { runningOutput: { type: "file", filename: "./logs/1.log" } },
        categories: { default: { appenders: ["runningOutput"], level: "all" } }
    });

    let job = schedule.scheduleJob(rule, async () => {
        let logger = log4js.getLogger('runningOutput')
        // logger.info("Update merkleRoot to contract")
        // TODO: 从接口获得数据
        // axios.post('http://nodejs.cn/todos', {
        //   todo: '做点事情'
        // })
        // console.log(new Date());
        let maxAmount = BigNumber.from(ethers.utils.randomBytes(8))
        let maxAmountInCurrentTree = BigNumber.from(maxAmount)
        console.log(maxAmountInCurrentTree)
        let merkle_root = ethers.utils.hexlify(ethers.utils.randomBytes(32))
        // let merkle_root = '0x07e53945068875f6744f084b4819b1bf4d947bebfcb073a4b5be6eb81bf7fa73'
        console.log("merkle_root: ", merkle_root)
        let errorCount = 0
        while (true) {
            try {
                // await expect(tradingRewards.updateTradingRewards(merkle_root, maxAmountInCurrentTree)).to.emit(tradingRewards, "UpdateTradingRewards").withArgs(currentRewardRound_remote.add(1).toString())
                assert.isOk( await tradingRewards.updateTradingRewards(merkle_root, maxAmountInCurrentTree))
                let currentRewardRound_remote = await tradingRewards.currentRewardRound()
                logger.info("Successfully updated merkle root: (", merkle_root, ",", currentRewardRound_remote.toString() , ",", maxAmountInCurrentTree.toString(), " )")
                break
            } catch (err) {
                if (errorCount++ < 5) {
                    console.error(err)
                    console.log("try again")
                } else {
                    logger.error("Fail to update merkleRoot")
                    logger.error(err)
                    break
                }
            }
        }
    })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
