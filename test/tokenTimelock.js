const Timelock = artifacts.require('Timelock')
const MahaToken = artifacts.require('MahaToken')


contract('Timelock', function (accounts) {
    const ROLE = '0x00'
    const MINTER_ROLE = 'MINTER_ROLE'
    const unlockTimestamp = Math.floor(Date.now() / 1000) + 60

    beforeEach(async function () {
        this.token = await MahaToken.new()
        this.timelock = await Timelock.new(this.token.address, unlockTimestamp)
    })

    it('Should give DEFAULT_ADMIN_ROLE to timelocks', async function () {
        await this.token.grantRole(ROLE, this.timelock.address)

        assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
    })

    it('Should give DEFAULT_ADMIN_ROLE to timelocks and revoke for self', async function () {
        await this.token.grantRole(ROLE, this.timelock.address)
        await this.token.revokeRole(ROLE, accounts[0])

        assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
        assert.equal(await this.token.hasRole(ROLE, accounts[0]), false)
    })

    it('Should not allow giving DEFAULT_ADMIN_ROLE to timelock owner before unlockTimestamp', async function () {
        await this.token.grantRole(ROLE, this.timelock.address)
        await this.token.revokeRole(ROLE, accounts[0])

        assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
        assert.equal(await this.token.hasRole(ROLE, accounts[0]), false)

        try {
            await this.timelock.setAdminRole()
        } catch (error) {
            assert(error, "Timelock: early minting not allowed");
        }
    })

    it('Should allow giving DEFAULT_ADMIN_ROLE to timelock owner after unlockTimestamp', async function () {
        await this.token.grantRole(ROLE, this.timelock.address)
        await this.token.revokeRole(ROLE, accounts[0])

        assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
        assert.equal(await this.token.hasRole(ROLE, accounts[0]), false)

        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [unlockTimestamp - Math.floor(Date.now() / 1000) + 60],
            id: new Date().getSeconds()
        }, async (err, resp) => {
            if (!err)
                web3.currentProvider.send({
                    jsonrpc: '2.0',
                    method: 'evm_mine',
                    params: [],
                    id: new Date().getSeconds()
                }, async (err, res) => {
                    await this.timelock.setAdminRole()

                    assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
                    assert.equal(await this.token.hasRole(ROLE, accounts[0]), true)
                })
        })
    })
})