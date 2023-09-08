const { expect } = require('chai')
const { ethers } = require('hardhat')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe('Contract', () => {
  let contract, result

  // Organization data
  const oid = 1
  const orgName = 'Dapp Mentors Academy'
  const orgDesc = 'A web3 development and transition academy'

  // Payroll data
  const pid = 1
  const payrollName = 'Dapp Mentors Instructors Payroll'
  const payrollDesc = 'A list of Dapp Mentors trainers payment slab'
  const payrollSalary = toWei(0.5)
  const payrollCut = 5

  const status = {
    OPEN: 0,
    PENDING: 1,
    DELETED: 2,
    APPROVED: 3,
    REJECTED: 4,
    PAID: 5,
  }

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('DappPay')
    ;[orgAcc1, orgAcc2, officer1, officer2, worker1, worker2, worker3] =
      await ethers.getSigners()

    contract = await Contract.deploy()
    await contract.deployed()
  })

  describe('Organization', () => {
    it('Should confirm organization creation', async () => {
      result = await contract.getOrgs()
      expect(result).to.have.lengthOf(0)

      result = await contract.connect(orgAcc2).getMyOrgs()
      expect(result).to.have.lengthOf(0)

      await contract.createOrg(orgName, orgDesc)

      result = await contract.getOrgs()
      expect(result).to.have.lengthOf(1)

      result = await contract.getMyOrgs()
      expect(result).to.have.lengthOf(1)

      result = await contract.connect(orgAcc2).getMyOrgs()
      expect(result).to.have.lengthOf(0)
    })

    it('Should confirm organization update', async () => {
      await contract.createOrg(orgName, orgDesc)

      result = await contract.getOrgById(oid)
      expect(result.name).to.be.equal(orgName)
      expect(result.description).to.be.equal(orgDesc)

      const newName = 'Dapp Mentors Org'
      const newDesc = 'Updated Dapp Mentors Org description'

      await contract.updateOrg(oid, newName, newDesc)

      result = await contract.getOrgById(oid)
      expect(result.name).to.be.equal(newName)
      expect(result.description).to.be.equal(newDesc)
    })
  })

  describe('Payroll', () => {
    beforeEach(async () => {
      await contract.createOrg(orgName, orgDesc)
      await contract.connect(orgAcc2).createOrg(orgName, orgDesc)
    })

    it('Should confirm payroll creation', async () => {
      result = await contract.getPayrolls()
      expect(result).to.have.lengthOf(0)

      result = await contract.getMyActivePayrolls()
      expect(result).to.have.lengthOf(0)

      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      result = await contract.getPayrolls()
      expect(result).to.have.lengthOf(1)

      result = await contract.connect(officer1).getMyActivePayrolls()
      expect(result).to.have.lengthOf(1)

      result = await contract.getPayroll(pid)
      expect(result.name).to.be.equal(payrollName)
      expect(result.description).to.be.equal(payrollDesc)
      expect(result.officer).to.be.equal(officer1.address)
      expect(result.organization).to.be.equal(orgAcc1.address)
    })

    it('Should confirm payroll update', async () => {
      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      result = await contract.getPayroll(pid)
      expect(result.name).to.be.equal(payrollName)
      expect(result.organization).to.be.equal(orgAcc1.address)

      const newName = 'Updated payroll name for DMA'
      const newDesc = 'Updated payroll description for DMA'

      await contract
        .connect(officer1)
        .updatePayroll(
          pid,
          oid + 1,
          newName,
          newDesc,
          payrollSalary,
          payrollCut
        )

      result = await contract.getPayroll(pid)
      expect(result.name).to.be.equal(newName)
      expect(result.description).to.be.equal(newDesc)
      expect(result.organization).to.be.equal(orgAcc2.address)
    })

    it('Should confirm payroll delete', async () => {
      result = await contract.getOrgById(oid)
      expect(result.payrolls).to.be.equal(0)

      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.OPEN)

      result = await contract.getOrgById(oid)
      expect(result.payrolls).to.be.equal(1)

      await contract.connect(officer1).deletePayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.DELETED)

      result = await contract.getOrgById(oid)
      expect(result.payrolls).to.be.equal(0)
    })

    it('Should confirm payroll approval', async () => {
      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.OPEN)

      await contract.connect(officer1).submitPayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.PENDING)

      await contract.approvePayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.APPROVED)
    })

    it('Should confirm payroll reject', async () => {
      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.OPEN)

      await contract.connect(officer1).submitPayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.PENDING)

      await contract.rejectPayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.REJECTED)
    })

    it('Should confirm payroll revert', async () => {
      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.OPEN)

      await contract.connect(officer1).submitPayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.PENDING)

      await contract.revertPayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.OPEN)
    })
  })

  describe('Worker', () => {
    beforeEach(async () => {
      await contract.createOrg(orgName, orgDesc)
      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)
    })

    it('Should confirm worker creation', async () => {
      result = await contract.getPayrollWorkers(pid)
      expect(result).to.have.lengthOf(0)

      const names = ['Prince Daniel', 'Job Halem', 'Okafor James']
      const accounts = [worker1.address, worker2.address, worker3.address]

      await contract.connect(officer1).createWorker(pid, names, accounts)

      result = await contract.getPayrollWorkers(pid)
      expect(result).to.have.lengthOf(accounts.length)
    })

    it('Should confirm worker update', async () => {
      const wid = 1
      const newName = 'Abraham Lincol'

      const name = 'Matt Moduck'
      const account = worker2.address

      const names = [name]
      const accounts = [account]

      await contract.connect(officer1).createWorker(pid, names, accounts)

      result = await contract.getPayrollWorker(pid, wid)
      expect(result.name).to.be.equal(name)
      expect(result.account).to.be.equal(account)

      await contract.connect(officer1).updateWorker(wid, pid, newName, account)

      result = await contract.getPayrollWorker(pid, wid)
      expect(result.name).to.be.equal(newName)
      expect(result.account).to.be.equal(account)
    })

    it('Should confirm worker delete', async () => {
      const wid = 1
      const names = ['Prince Daniel', 'Job Halem', 'Okafor James']
      const accounts = [worker1.address, worker2.address, worker3.address]

      result = await contract.getPayrollWorkers(pid)
      expect(result).to.have.lengthOf(0)

      result = await contract.getAllWorkers()
      expect(result).to.have.lengthOf(0)

      await contract.connect(officer1).createWorker(pid, names, accounts)

      result = await contract.getPayrollWorkers(pid)
      expect(result).to.have.lengthOf(accounts.length)

      result = await contract.getAllWorkers()
      expect(result).to.have.lengthOf(accounts.length)

      await contract.connect(officer1).deleteWorker(wid, pid)

      result = await contract.getPayrollWorkers(pid)
      expect(result).to.have.lengthOf(accounts.length - 1)

      result = await contract.getAllWorkers()
      expect(result).to.have.lengthOf(accounts.length)
    })
  })

  describe('Funding and Payment', () => {
    beforeEach(async () => {
      await contract.createOrg(orgName, orgDesc)
      await contract
        .connect(officer1)
        .createPayroll(oid, payrollName, payrollDesc, payrollSalary, payrollCut)

      const names = ['Prince Daniel', 'Job Halem', 'Okafor James']
      const accounts = [worker1.address, worker2.address, worker3.address]

      await contract.connect(officer1).createWorker(pid, names, accounts)

      await contract.connect(officer1).submitPayroll(pid)
      await contract.connect(orgAcc1).approvePayroll(pid)
    })

    it('Should confirm organization funding', async () => {
      const fund = toWei(10)

      result = await contract.getOrgs()
      expect(result).to.have.lengthOf(1)

      result = await contract.getOrgById(oid)
      expect(result.balance).to.be.equal(0)

      await contract.fundOrg(oid, { value: fund })

      result = await contract.getOrgById(oid)
      expect(result.balance).to.be.equal(fund)
    })

    it('Should confirm workers payments', async () => {
      const fund = toWei(10)
      await contract.fundOrg(oid, { value: fund })

      result = await contract.getOrgById(oid)
      expect(result.balance).to.be.equal(fund)

      await contract.connect(officer1).payWorkers(pid)

      result = await contract.getPayroll(pid)
      const salaries = result.salary * 3

      result = await contract.getOrgById(oid)
      expect(result.balance).to.be.equal((fund - salaries).toString())
    })

    it('Should confirm opening of payroll', async () => {
      const fund = toWei(10)
      await contract.fundOrg(oid, { value: fund })

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.APPROVED)

      await contract.connect(officer1).payWorkers(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.PAID)

      await contract.openPayroll(pid)

      result = await contract.getPayroll(pid)
      expect(result.status).to.be.equal(status.OPEN)
    })

    it('Should confirm withrawal of cuts', async () => {
      const fund = toWei(10)
      await contract.fundOrg(oid, { value: fund })

      result = await contract.getOrgById(oid)
      expect(result.cuts).to.be.equal(0)

      await contract.connect(officer1).payWorkers(pid)

      result = await contract.getPayroll(pid)
      const cuts = ((result.salary * result.cut) / 100) * 3

      result = await contract.getOrgById(oid)
      expect(result.cuts).to.be.equal(cuts.toString())

      await contract.withdrawlFrom(oid, worker3.address, cuts.toString())

      result = await contract.getOrgById(oid)
      expect(result.cuts).to.be.equal(0)
    })
  })
})
