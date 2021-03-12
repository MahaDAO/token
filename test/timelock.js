const Timelock = artifacts.require('Timelock')
const MahaToken = artifacts.require('MahaToken')


contract('Timelock', function (Timelock) {
    beforeEach(async function () {
        this.token = await MahaToken.new()
        this.timelock = await MahaToken.new()
    })

    it('Should deploy properly', async function () {
        const tokenInstance = await MahaToken.deployed()
        const timelockInstance = await Timelock.deployed()

        assert.notEqual(tokenInstance, null)
        assert.notEqual(timelockInstance, null)
    })

    it('Should not work if not the owner of timelock', async function () {
        assert.equal(await this.token.name(), 'MahaDAO')
        assert.equal(await this.token.symbol(), 'MAHA')
        assert.equal(await this.token.decimals(), 18)
    })
})