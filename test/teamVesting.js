const {
    BN,
    increaseTime,
    expectEvent,
    assertRevert,
} = require('@openzeppelin/test-helpers');

const MahaToken = artifacts.require('MahaToken')
const TeamVesting = artifacts.require('TeamVesting')


contract('TeamVesting', function (accounts) {
    beforeEach(async function () {
        this.token = await MahaToken.new()
        this.teamVesting = await TeamVesting.new(accounts[1])

        // mint 10mn tokens
        await this.token.mint(accounts[0], 10000000)
    })

    it('should deploy properly with the right values', async function () {
        assert.notEqual(this.teamVesting, null)
        assert.equal(await this.token.totalSupply(), 10000000)
        assert.equal(await this.teamVesting.beneficiary(), accounts[1])
        assert.equal(await this.teamVesting.owner(), accounts[0])
        assert.equal(await this.teamVesting.start(), 1639699200)
        assert.equal(await this.teamVesting.duration(), 126144000)
        assert.equal(await this.teamVesting.cliff(), 1639699200)
        assert.equal(await this.teamVesting.revocable(), true)
    })


    describe('token unlocks should happen properly', function () {
        beforeEach(async function () {
            this.token.transfer(this.teamVesting.address, 700000)
        })

        it('ensure on day 0; 700,000 tokens have been deposited', async function () {
            assert.equal(await this.token.balanceOf(this.teamVesting.address), 700000)
        })


        it('ensure on day 0; 0 tokens are released', async function () {
            assert.equal(await this.teamVesting.released(this.token.address), 0)
        })


        it('dec 17th 2020 - unlock should give out 0 tokens', async function () {
            assert.equal(await this.teamVesting.releasableAmount(this.token.address), 0)
        })

        it('dec 16th 2021 - unlock should give out 0 tokens', async function () {
            // increaseTime()
            console.log((await this.teamVesting.now()).toNumber())
            assert.equal(await this.teamVesting.releasableAmount(this.token.address), 0)
        })

        it('jan 17th 2022 - should give out 19,444 tokens', async function () {

        })

        it('jan 17th 2024 - should give out 700,000 tokens', async function () {

        })
    })



    it('should change the beneficiary properly', async function () {
        assert.notEqual(this.teamVesting, null)
        assert.equal(await this.teamVesting.beneficiary(), accounts[1])
        assert.equal(await this.teamVesting.owner(), accounts[0])
        assert.equal(await this.teamVesting.start(), 1639699200)
        assert.equal(await this.teamVesting.duration(), 126144000)
        assert.equal(await this.teamVesting.cliff(), 1639699200)
        assert.equal(await this.teamVesting.revocable(), true)
    })

    // describe('claimReward()', async function () {
    //     const userId = '123'

    //     const reward = 100
    //     const nonce = Math.floor(Date.now() / 1000) + 60
    //     const rewardAddress = accounts[1]

    //     const { hash, data } = utils.generateHash(reward, rewardAddress, nonce, userId, cryptoControlPrivateKey)

    //     console.log(`"${reward}","${nonce}","${userId}","${utils.bufferToHex(data)}","${hash.v}","${utils.bufferToHex(hash.r)}","${utils.bufferToHex(hash.s)}"`)
    //     // console.log(
    //     //     reward,
    //     //     nonce,
    //     //     userId,

    //     //     utils.bufferToHex(data),
    //     //     hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
    //     //         from: rewardAddress
    //     //     }
    //     // )

    //     beforeEach(async function () {
    //         this.result = await this.teamVesting.claimReward(
    //             reward,
    //             nonce,
    //             userId,

    //             utils.bufferToHex(data),
    //             hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
    //             from: rewardAddress
    //         }
    //         )
    //     })


    //     it('should mint tokens', async function () {
    //         assert.notEqual(true, null)
    //     })


    //     it('should emit RewardClaimed() event with the right parameters', async function () {
    //         const event = await expectEvent.inLogs(this.result.logs, 'RewardClaimed')
    //         assert.equal(event.args.dest, rewardAddress)
    //         assert.equal(event.args.amount, reward)
    //         assert.equal(event.args.nonce, nonce)
    //     })


    //     it('should revert a second claim reward with same nonce', async function () {
    //         await assertRevert(
    //             this.teamVesting.claimReward(
    //                 reward, nonce, userId, utils.bufferToHex(data),
    //                 hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s),
    //                 {
    //                     from: rewardAddress
    //                 }
    //             )
    //         );
    //     })


    //     it('should revert a second claim reward with higher nonce but at the same time', async function () {
    //         const newNonce = nonce + 60 * 5
    //         const { hash, data } = utils.generateHash(reward, rewardAddress, newNonce, userId, cryptoControlPrivateKey)

    //         await assertRevert(
    //             this.teamVesting.claimReward(
    //                 reward, newNonce, userId, utils.bufferToHex(data),
    //                 hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
    //                 from: rewardAddress
    //             }
    //             )
    //         );
    //     })

    //     it('should revert a second claim reward with same nonce but at later time', async function () {
    //         await increaseTime(60 * 5 + 1);

    //         await assertRevert(
    //             this.teamVesting.claimReward(
    //                 reward, nonce, userId, utils.bufferToHex(data),
    //                 hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
    //                 from: rewardAddress
    //             }
    //             )
    //         )
    //     })


    //     it('should not revert a second claim reward with higher nonce at later time', async function () {
    //         const newNonce = nonce + 60 * 5
    //         const { hash, data } = utils.generateHash(reward, rewardAddress, newNonce, userId, cryptoControlPrivateKey)

    //         await increaseTime(60 * 5 + 1);

    //         const result = this.teamVesting.claimReward(
    //             reward, newNonce, userId, utils.bufferToHex(data),
    //             hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
    //             from: rewardAddress
    //         }
    //         )

    //         assert.notEqual(result, null)
    //     })
    // })
})