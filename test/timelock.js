const Timelock = artifacts.require('Timelock')
const MahaToken = artifacts.require('MahaToken')


contract('Timelock', function (accounts) {
    const ROLE = '0x00'

    beforeEach(async function () {
        this.token = await MahaToken.new()
        this.timelock = await Timelock.new(this.token.address, Math.floor(Date.now() / 1000) + 60 * 60)
    })

    it('Should transfer DEFAULT_ADMIN_ROLE to timelocks', async function () {
        await this.token.grantRole(ROLE, this.timelock.address)

        assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
    })
})