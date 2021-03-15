import "@nomiclabs/hardhat-ethers"

import { ethers } from 'hardhat'
import chai, { expect } from 'chai'
import { solidity } from 'ethereum-waffle'
import { Provider } from '@ethersproject/providers'
import { Contract, ContractFactory, BigNumber, utils } from 'ethers'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

import { advanceTimeAndBlock } from './utilities'



chai.use(solidity)


describe('Timelock', async function () {
  const ROLE = '0x00'
  const MINTER_ROLE = 'MINTER_ROLE'
  const unlockTimestamp = Math.floor(Date.now() / 1000) + 60

  const { provider } = ethers

  let ant: SignerWithAddress
  let owner: SignerWithAddress

  before('provider & accounts setting', async () => {
    [owner, ant] = await ethers.getSigners();
  });

  const Token: ContractFactory = await ethers.getContractFactory('MahaToken')
  const Timelock: ContractFactory = await ethers.getContractFactory('Timelock')

  let token: Contract
  let timelock: Contract

  beforeEach(async function () {
    token = await Token.connect(owner).deploy()
    timelock = await Timelock.connect(owner).deploy(this.token.address, unlockTimestamp)
  })

  it('Should give DEFAULT_ADMIN_ROLE to timelocks', async function () {
    await token.connect(owner).grantRole(ROLE, timelock.address)

    expect(await token.hasRole(ROLE, this.timelock.address)).to.eq(true)
  })

  it('Should give DEFAULT_ADMIN_ROLE to timelocks and revoke for self', async function () {
    await token.connect(owner).grantRole(ROLE, timelock.address)
    await token.connect(owner).revokeRole(ROLE, owner.address)

    expect(await token.hasRole(ROLE, owner.address)).to.eq(false)
    expect(await token.hasRole(ROLE, timelock.address)).to.eq(true)
  })

  it('Should not allow giving DEFAULT_ADMIN_ROLE to timelock owner before unlockTimestamp', async function () {
    await token.connect(owner).grantRole(ROLE, timelock.address)
    await token.connect(owner).revokeRole(ROLE, owner.address)

    expect(await token.hasRole(ROLE, owner.address)).to.eq(false)
    expect(await token.hasRole(ROLE, timelock.address)).to.eq(true)

    await expect(timelock.setAdminRole()).to.reverted
  })

  // it('Should allow giving DEFAULT_ADMIN_ROLE to timelock owner after unlockTimestamp', async function () {
  //     await this.token.grantRole(ROLE, this.timelock.address)
  //     await this.token.revokeRole(ROLE, accounts[0])

  //     assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
  //     assert.equal(await this.token.hasRole(ROLE, accounts[0]), false)

  //     web3.currentProvider.send({
  //         jsonrpc: '2.0',
  //         method: 'evm_increaseTime',
  //         params: [unlockTimestamp - Math.floor(Date.now() / 1000) + 60],
  //         id: new Date().getSeconds()
  //     }, async (err, resp) => {
  //         if (!err)
  //             web3.currentProvider.send({
  //                 jsonrpc: '2.0',
  //                 method: 'evm_mine',
  //                 params: [],
  //                 id: new Date().getSeconds()
  //             }, async (err, res) => {
  //                 await this.timelock.setAdminRole()

  //                 assert.equal(await this.token.hasRole(ROLE, this.timelock.address), true)
  //                 assert.equal(await this.token.hasRole(ROLE, accounts[0]), true)
  //             })
  //     })
  // })
})
