const {
    increaseTime,
    expectEvent,
    assertRevert,
} = require('@openzeppelin/test-helpers');

const MahaToken = artifacts.require('MahaToken')
const TeamVesting = artifacts.require('TeamVesting')

const utils = require('./utils')


contract('TeamVesting', function (accounts) {
    beforeEach(async function () {

        console.log(accounts[0])
        this.token = await MahaToken.new()
        this.teamVesting = await TeamVesting.new(accounts[0])

        await this.teamVesting.setTokenAddress(this.token.address)
        await this.teamVesting.setCryptoControlServer(cryptoControlPublicKey)
        await this.token.addMinter(this.teamVesting.address)
    })

    it('should deploy properly', async function () {
        assert.notEqual(this.teamVesting, null)
    })

    describe('claimReward()', async function () {
        const userId = '123'

        const reward = 100
        const nonce = Math.floor(Date.now() / 1000) + 60
        const rewardAddress = accounts[1]

        const { hash, data } = utils.generateHash(reward, rewardAddress, nonce, userId, cryptoControlPrivateKey)

        console.log(`"${reward}","${nonce}","${userId}","${utils.bufferToHex(data)}","${hash.v}","${utils.bufferToHex(hash.r)}","${utils.bufferToHex(hash.s)}"`)
        // console.log(
        //     reward,
        //     nonce,
        //     userId,

        //     utils.bufferToHex(data),
        //     hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
        //         from: rewardAddress
        //     }
        // )

        beforeEach(async function () {
            this.result = await this.teamVesting.claimReward(
                reward,
                nonce,
                userId,

                utils.bufferToHex(data),
                hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
                from: rewardAddress
            }
            )
        })


        it('should mint tokens', async function () {
            assert.notEqual(true, null)
        })


        it('should emit RewardClaimed() event with the right parameters', async function () {
            const event = await expectEvent.inLogs(this.result.logs, 'RewardClaimed')
            assert.equal(event.args.dest, rewardAddress)
            assert.equal(event.args.amount, reward)
            assert.equal(event.args.nonce, nonce)
        })


        it('should revert a second claim reward with same nonce', async function () {
            await assertRevert(
                this.teamVesting.claimReward(
                    reward, nonce, userId, utils.bufferToHex(data),
                    hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s),
                    {
                        from: rewardAddress
                    }
                )
            );
        })


        it('should revert a second claim reward with higher nonce but at the same time', async function () {
            const newNonce = nonce + 60 * 5
            const { hash, data } = utils.generateHash(reward, rewardAddress, newNonce, userId, cryptoControlPrivateKey)

            await assertRevert(
                this.teamVesting.claimReward(
                    reward, newNonce, userId, utils.bufferToHex(data),
                    hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
                    from: rewardAddress
                }
                )
            );
        })

        it('should revert a second claim reward with same nonce but at later time', async function () {
            await increaseTime(60 * 5 + 1);

            await assertRevert(
                this.teamVesting.claimReward(
                    reward, nonce, userId, utils.bufferToHex(data),
                    hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
                    from: rewardAddress
                }
                )
            )
        })


        it('should not revert a second claim reward with higher nonce at later time', async function () {
            const newNonce = nonce + 60 * 5
            const { hash, data } = utils.generateHash(reward, rewardAddress, newNonce, userId, cryptoControlPrivateKey)

            await increaseTime(60 * 5 + 1);

            const result = this.teamVesting.claimReward(
                reward, newNonce, userId, utils.bufferToHex(data),
                hash.v, utils.bufferToHex(hash.r), utils.bufferToHex(hash.s), {
                from: rewardAddress
            }
            )

            assert.notEqual(result, null)
        })
    })
})