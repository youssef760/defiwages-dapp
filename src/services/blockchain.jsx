import abi from '../abis/src/contracts/DappPay.sol/DappPay.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'
import { store } from '../store'
import { globalActions } from '../store/globalSlices'

const {
  setConnectedAccount,
  setStats,
  setAllOrgs,
  setOrgs,
  setPayrolls,
  setPayroll,
  setWorkers,
  setAllPayrolls,
} = globalActions

const { ethereum } = window
const ContractAddress = address.address
const ContractAbi = abi.abi
let tx

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getEthereumContract = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = accounts[0]
    ? new ethers.providers.Web3Provider(ethereum)
    : new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
  const wallet = accounts[0] ? null : ethers.Wallet.createRandom()
  const signer = provider.getSigner(accounts[0] ? undefined : wallet.address)

  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

const connectWallet = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    store.dispatch(setConnectedAccount(accounts[0]))
  } catch (error) {
    reportError(error)
  }
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', async () => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      store.dispatch(setConnectedAccount(accounts[0]))
      await loadData()
      await isWalletConnected()
    })

    if (accounts.length) {
      store.dispatch(setConnectedAccount(accounts[0]))
    } else {
      store.dispatch(setConnectedAccount(''))
      console.log('No accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

const fundOrg = async (oid, amount) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.fundOrg(oid, { value: toWei(amount) })
      await tx.wait()
      await loadData()

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const createOrg = async (name, description) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.createOrg(name, description)
      await tx.wait()
      await loadData()

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const updateOrg = async ({ id, name, description }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.updateOrg(id, name, description)
      await tx.wait()
      await loadData()

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const loadStats = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const stats = await contract.getMyStats()
    store.dispatch(setStats(structuredOrgs([stats])[0]))
  } catch (error) {
    reportError(error)
  }
}

const loadOrgs = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const orgs = await contract.getOrgs()
    store.dispatch(setAllOrgs(structuredOrgs(orgs)))
  } catch (error) {
    reportError(error)
  }
}

const loadMyOrgs = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const orgs = await contract.getMyOrgs()
    store.dispatch(setOrgs(structuredOrgs(orgs)))
  } catch (error) {
    reportError(error)
  }
}

const createPayroll = async ({ oid, name, description, salary, cut }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.createPayroll(
        oid,
        name,
        description,
        toWei(salary),
        cut
      )
      await tx.wait()
      await loadData()
      await loadPayrollByOrg(oid)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const updatePayroll = async ({ id, oid, name, description, salary, cut }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.updatePayroll(
        id,
        oid,
        name,
        description,
        toWei(salary),
        cut
      )
      await tx.wait()
      await loadData()
      await loadPayrollByOrg(oid)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const deletePayroll = async ({ id, oid }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.deletePayroll(id)
      await tx.wait()
      await loadData()
      await loadPayrollByOrg(oid)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const loadPayrollByOrg = async (oid) => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const payrolls = await contract.getMyPayrollsByOrg(oid)
    store.dispatch(setPayrolls(structuredPayrolls(payrolls)))
  } catch (error) {
    reportError(error)
  }
}

const loadPayroll = async (id) => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const payroll = await contract.getPayroll(id)
    store.dispatch(setPayroll(structuredPayrolls([payroll])[0]))
  } catch (error) {
    reportError(error)
  }
}

const createWorker = async ({ id, names, accounts }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.createWorker(id, names, accounts)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const updateWorker = async ({ wid, id, name, account }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.updateWorker(wid, id, name, account)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const deleteWorker = async (id, wid) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.deleteWorker(wid, id)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const loadWorkersOf = async (id) => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const workers = await contract.getPayrollWorkers(id)
    store.dispatch(setWorkers(structuredWorkers(workers)))
  } catch (error) {
    reportError(error)
  }
}

const submitPayroll = async ({ id }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.submitPayroll(id)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const approvePayroll = async ({ id }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.approvePayroll(id)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const revertPayroll = async ({ id }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.revertPayroll(id)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const rejectPayroll = async ({ id }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.rejectPayroll(id)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const payWorkers = async ({ id }) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.payWorkers(id)
      await tx.wait()
      await loadData()
      await loadPayroll(id)
      await loadWorkersOf(id)

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const withdrawTo = async (oid, account, amount) => {
  if (!ethereum) return reportError('Please install Metamask')

  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.withdrawlFrom(oid, account, toWei(amount))
      await tx.wait()
      await loadData()

      resolve(tx)
    } catch (error) {
      reportError(error)
      reject(error)
    }
  })
}

const loadAllPayrolls = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const contract = await getEthereumContract()
    const payrolls = await contract.getPayrolls()
    store.dispatch(setAllPayrolls(structuredPayrolls(payrolls)))
  } catch (error) {
    reportError(error)
  }
}

const loadData = async () => {
  await loadStats()
  await loadOrgs()
  await loadMyOrgs()
  await loadAllPayrolls()
}

const structuredOrgs = (orgs) =>
  orgs.map((org) => ({
    id: org.id.toNumber(),
    account: org.account,
    cuts: fromWei(org.cuts),
    balance: fromWei(org.balance),
    name: org.name,
    description: org.description,
    payments: org.payments.toNumber(),
    payrolls: org.payrolls.toNumber(),
    workers: org.workers.toNumber(),
  }))

const structuredPayrolls = (payrolls) =>
  payrolls.map((payroll) => ({
    id: payroll.id.toNumber(),
    oid: payroll.oid.toNumber(),
    cut: payroll.cut.toNumber(),
    workers: payroll.workers.toNumber(),
    officer: payroll.officer.toLowerCase(),
    organization: payroll.organization.toLowerCase(),
    name: payroll.name,
    description: payroll.description,
    timestamp: payroll.timestamp.toNumber(),
    salary: fromWei(payroll.salary),
    status: payroll.status,
  }))

const structuredWorkers = (workers) =>
  workers.map((worker) => ({
    id: worker.id.toNumber(),
    wid: worker.wid.toNumber(),
    name: worker.name,
    account: worker.account,
    timestamp: worker.timestamp.toNumber(),
  }))

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}

const reportError = (error) => {
  console.log(error)
}

export {
  connectWallet,
  isWalletConnected,
  loadData,
  fundOrg,
  createOrg,
  updateOrg,
  createPayroll,
  updatePayroll,
  deletePayroll,
  loadPayroll,
  loadPayrollByOrg,
  createWorker,
  updateWorker,
  deleteWorker,
  loadWorkersOf,
  submitPayroll,
  approvePayroll,
  revertPayroll,
  rejectPayroll,
  payWorkers,
  withdrawTo,
  truncate,
}
