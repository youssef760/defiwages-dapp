const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  const Contract = await ethers.getContractFactory('DappPay')
  const contract = await Contract.deploy()
  await contract.deployed()

  const address = JSON.stringify({ address: contract.address }, null, 4)

  fs.writeFile('./src/abis/contractAddress.json', address, 'utf-8', (error) => {
    if (error) {
      console.log(error)
      return
    }
    console.log('Deployed contract address: ', contract.address)
  })
}

main().catch((error) => {
  console.log(error)
  process.exitCode = 1
})
