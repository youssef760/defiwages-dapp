//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DappPay is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _totalPayrolls;
    Counters.Counter private _totalOrganzations;
    Counters.Counter private _totalWorkers;

    enum Status {
        OPEN,
        PENDING,
        DELETED,
        APPROVED,
        REJECTED,
        PAID
    }

    struct OrganizationStruct {
        uint id;
        string name;
        string description;
        address account;
        uint payrolls;
        uint workers;
        uint payments;
        uint balance;
        uint cuts;
        uint timestamp;
    }

    struct PayrollStruct {
        uint id;
        uint oid;
        string name;
        string description;
        address officer;
        address organization;
        uint salary;
        uint cut;
        uint workers;
        uint timestamp;
        Status status;
    }

    struct WorkerStruct {
        uint id;
        uint wid;
        string name;
        address account;
        uint timestamp;
    }

    mapping(uint => PayrollStruct) payrolls;
    mapping(uint => OrganizationStruct) organizations;
    mapping(uint => WorkerStruct) workers;
    mapping(address => bool) workersExits;
    mapping(uint => mapping(uint => WorkerStruct)) workersOf;

    function createOrg(string memory name, string memory description) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        _totalOrganzations.increment();
        OrganizationStruct memory org;

        org.id = _totalOrganzations.current();
        org.name = name;
        org.description = description;
        org.account = msg.sender;
        org.timestamp = currentTime();

        organizations[org.id] = org;
    }

    function updateOrg(
        uint id,
        string memory name,
        string memory description
    ) public {
        require(organizations[id].id != 0, "Organization not found");
        require(organizations[id].account == msg.sender, "Unauthorized entity");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        organizations[id].name = name;
        organizations[id].description = description;
    }

    function getOrgs()
        public
        view
        returns (OrganizationStruct[] memory Organizations)
    {
        Organizations = new OrganizationStruct[](_totalOrganzations.current());

        for (uint i = 0; i < _totalOrganzations.current(); i++) {
            Organizations[i] = organizations[i + 1];
        }
    }

    function getMyOrgs()
        public
        view
        returns (OrganizationStruct[] memory Organization)
    {
        uint availableOrgs = 0;
        for (uint i = 0; i < _totalOrganzations.current(); i++) {
            if (organizations[i + 1].account == msg.sender) {
                availableOrgs++;
            }
        }

        Organization = new OrganizationStruct[](availableOrgs);

        uint j = 0;
        for (uint i = 0; i < _totalOrganzations.current(); i++) {
            if (organizations[i + 1].account == msg.sender) {
                Organization[j] = organizations[i + 1];
                j++;
            }
        }
    }

    function getOrgById(
        uint id
    ) public view returns (OrganizationStruct memory Organization) {
        return organizations[id];
    }

    function createPayroll(
        uint oid,
        string memory name,
        string memory description,
        uint salary,
        uint cut
    ) public {
        require(organizations[oid].id != 0, "Organization not found");
        require(salary > 0 ether, "Salary must be greater than zero");
        require(
            cut > 0 && cut <= 100,
            "Percentage cut must be between (1-100)"
        );
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        _totalPayrolls.increment();
        PayrollStruct memory payroll;

        payroll.id = _totalPayrolls.current();
        payroll.oid = oid;
        payroll.name = name;
        payroll.description = description;
        payroll.salary = salary;
        payroll.cut = cut;
        payroll.officer = msg.sender;
        payroll.organization = organizations[oid].account;
        payroll.timestamp = currentTime();

        payrolls[payroll.id] = payroll;
        organizations[oid].payrolls++;
    }

    function updatePayroll(
        uint id,
        uint oid,
        string memory name,
        string memory description,
        uint salary,
        uint cut
    ) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(payrolls[id].officer == msg.sender, "Unauthorized entity");
        require(organizations[oid].id != 0, "Organization not found");
        require(payrolls[id].status == Status.OPEN, "Payroll not available");
        require(salary > 0 ether, "Salary must be greater than zero");
        require(
            cut > 0 && cut <= 100,
            "Percentage cut must be between (1-100)"
        );
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        payrolls[id].oid = oid;
        payrolls[id].name = name;
        payrolls[id].description = description;
        payrolls[id].salary = salary;
        payrolls[id].cut = cut;
        payrolls[id].organization = organizations[oid].account;
    }

    function deletePayroll(uint id) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(payrolls[id].officer == msg.sender, "Unauthorized entity");
        require(payrolls[id].status == Status.OPEN, "Payroll not available");

        payrolls[id].status = Status.DELETED;
        organizations[payrolls[id].oid].payrolls--;
    }

    function submitPayroll(uint id) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(payrolls[id].officer == msg.sender, "Unauthorized entity");
        require(payrolls[id].status == Status.OPEN, "Payroll not available");

        payrolls[id].status = Status.PENDING;
    }

    function approvePayroll(uint id) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(payrolls[id].organization == msg.sender, "Unauthorized entity");
        require(payrolls[id].status == Status.PENDING, "Payroll not pending");

        payrolls[id].status = Status.APPROVED;
    }

    function rejectPayroll(uint id) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(payrolls[id].organization == msg.sender, "Unauthorized entity");
        require(payrolls[id].status == Status.PENDING, "Payroll not pending");

        payrolls[id].status = Status.REJECTED;
    }

    function revertPayroll(uint id) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(
            payrolls[id].officer == msg.sender ||
                payrolls[id].organization == msg.sender,
            "Unauthorized entity"
        );
        require(
            (payrolls[id].status == Status.PENDING ||
                payrolls[id].status == Status.REJECTED),
            "Payroll not pending"
        );

        payrolls[id].status = Status.OPEN;
    }

    function openPayroll(uint id) public {
        require(payrolls[id].id != 0, "Payroll not found");
        require(
            payrolls[id].officer == msg.sender ||
                payrolls[id].organization == msg.sender,
            "Unauthorized entity"
        );
        require(payrolls[id].status == Status.PAID, "Payroll not paid");

        payrolls[id].status = Status.OPEN;
    }

    function getPayrolls()
        public
        view
        returns (PayrollStruct[] memory Payrolls)
    {
        uint availablePayrolls = 0;
        for (uint i = 0; i < _totalPayrolls.current(); i++) {
            if (payrolls[i + 1].status != Status.DELETED) {
                availablePayrolls++;
            }
        }

        Payrolls = new PayrollStruct[](availablePayrolls);

        for (uint i = 0; i < _totalPayrolls.current(); i++) {
            if (payrolls[i + 1].status != Status.DELETED) {
                Payrolls[i] = payrolls[i + 1];
            }
        }
    }

    function getPayroll(
        uint id
    ) public view returns (PayrollStruct memory Payrolls) {
        return payrolls[id];
    }

    function getMyPayrollsByOrg(
        uint id
    ) public view returns (PayrollStruct[] memory Payrolls) {
        uint availablePayrolls = 0;

        for (uint i = 0; i < _totalPayrolls.current(); i++) {
            if (
                payrolls[i + 1].oid == id &&
                payrolls[i + 1].status != Status.DELETED &&
                (payrolls[i + 1].organization == msg.sender ||
                    payrolls[i + 1].officer == msg.sender)
            ) {
                availablePayrolls++;
            }
        }

        Payrolls = new PayrollStruct[](availablePayrolls);

        uint payrollIndex = 0;
        for (uint i = 0; i < _totalPayrolls.current(); i++) {
            if (
                payrolls[i + 1].oid == id &&
                payrolls[i + 1].status != Status.DELETED &&
                (payrolls[i + 1].organization == msg.sender ||
                    payrolls[i + 1].officer == msg.sender)
            ) {
                Payrolls[payrollIndex] = payrolls[i + 1];
                payrollIndex++;
            }
        }
    }

    function getMyActivePayrolls()
        public
        view
        returns (PayrollStruct[] memory Payrolls)
    {
        uint availablePayrolls = 0;
        for (uint i = 0; i < _totalPayrolls.current(); i++) {
            if (
                payrolls[i + 1].status != Status.DELETED &&
                (payrolls[i + 1].officer == msg.sender ||
                    payrolls[i + 1].organization == msg.sender)
            ) {
                availablePayrolls++;
            }
        }

        Payrolls = new PayrollStruct[](availablePayrolls);

        uint payrollIndex = 0;
        for (uint i = 0; i < _totalPayrolls.current(); i++) {
            if (
                payrolls[i + 1].status != Status.DELETED &&
                (payrolls[i + 1].officer == msg.sender ||
                    payrolls[i + 1].organization == msg.sender)
            ) {
                Payrolls[payrollIndex] = payrolls[i + 1];
                payrollIndex++;
            }
        }
    }

    function createWorker(
        uint pid,
        string[] memory names,
        address[] memory accounts
    ) public {
        require(payrolls[pid].id != 0, "Payroll not found");
        require(
            payrolls[pid].officer == msg.sender ||
                payrolls[pid].organization == msg.sender,
            "Unauthorized entity"
        );
        require(names.length > 0, "Names array cannot be empty");
        require(accounts.length > 0, "Accounts array cannot be empty");

        for (uint i = 0; i < accounts.length; i++) {
            _totalWorkers.increment();
            WorkerStruct memory worker;

            worker.id = _totalWorkers.current();
            worker.wid = payrolls[pid].workers + 1;
            worker.name = names[i];
            worker.account = accounts[i];
            worker.timestamp = currentTime();

            workersOf[pid][worker.wid] = worker;
            payrolls[pid].workers++;
            organizations[payrolls[pid].oid].workers++;

            if (!workersExits[accounts[i]]) {
                workersExits[accounts[i]] = true;
                workers[worker.id] = worker;
            }
        }
    }

    function updateWorker(
        uint wid,
        uint pid,
        string memory name,
        address account
    ) public {
        require(workersOf[pid][wid].id != 0, "Worker not found");
        require(
            payrolls[pid].officer == msg.sender ||
                payrolls[pid].organization == msg.sender,
            "Unauthorized entity"
        );
        require(bytes(name).length > 0, "Name cannot be empty");
        require(account != address(0), "Accound cannot be empty");

        workersOf[pid][wid].name = name;
        workersOf[pid][wid].account = account;

        workers[workersOf[pid][wid].id].name = name;
        workers[workersOf[pid][wid].id].account = account;
    }

    function deleteWorker(uint wid, uint pid) public {
        require(workersOf[pid][wid].id != 0, "Worker not found");
        require(payrolls[pid].officer == msg.sender, "Unauthorized entity");

        uint lastWorkerIndex = payrolls[pid].workers;
        WorkerStruct memory worker = workersOf[pid][wid];
        workersOf[pid][wid] = workersOf[pid][lastWorkerIndex];

        workersOf[pid][wid].wid = worker.wid;
        delete workersOf[pid][lastWorkerIndex];

        payrolls[pid].workers--;
        organizations[payrolls[pid].oid].workers--;
    }

    function payWorkers(uint pid) public nonReentrant {
        require(payrolls[pid].id != 0, "Payroll not found");
        require(payrolls[pid].officer == msg.sender, "Unauthorized entity");
        require(
            payrolls[pid].status == Status.APPROVED,
            "Payroll not approved"
        );
        require(
            organizations[payrolls[pid].oid].balance >=
                payrolls[pid].workers * payrolls[pid].salary,
            "Insufficient fund"
        );

        uint numWorker = payrolls[pid].workers;
        uint salary = payrolls[pid].salary;
        uint cut = (salary * payrolls[pid].cut) / 100;

        for (uint wid = 1; wid <= numWorker; wid++) {
            address account = workersOf[pid][wid].account;
            payTo(account, (salary - cut));
        }

        organizations[payrolls[pid].oid].balance -= salary * numWorker;
        organizations[payrolls[pid].oid].cuts += cut * numWorker;
        organizations[payrolls[pid].oid].payments++;

        payrolls[pid].status = Status.PAID;
    }

    function getPayrollWorkers(
        uint pid
    ) public view returns (WorkerStruct[] memory Workers) {
        Workers = new WorkerStruct[](payrolls[pid].workers);

        for (uint i = 0; i < payrolls[pid].workers; i++) {
            Workers[i] = workersOf[pid][i + 1];
        }
    }

    function getPayrollWorker(
        uint pid,
        uint wid
    ) public view returns (WorkerStruct memory Workers) {
        return workersOf[pid][wid];
    }

    function getAllWorkers()
        public
        view
        returns (WorkerStruct[] memory Workers)
    {
        Workers = new WorkerStruct[](_totalWorkers.current());

        for (uint i = 0; i < _totalWorkers.current(); i++) {
            Workers[i] = workers[i + 1];
        }
    }

    function getMyStats()
        public
        view
        returns (OrganizationStruct memory Organization)
    {
        for (uint i = 0; i < _totalOrganzations.current(); i++) {
            if (organizations[i + 1].account == msg.sender) {
                Organization.id++;
                Organization.name = "Your Global Stats";
                Organization
                    .description = "Your statistics accross all organizations created by you";
                Organization.account = msg.sender;
                Organization.payments += organizations[i + 1].payments;
                Organization.cuts += organizations[i + 1].cuts;
                Organization.payrolls += organizations[i + 1].payrolls;
                Organization.workers += organizations[i + 1].workers;
                Organization.balance += organizations[i + 1].balance;
            }
        }
    }

    function fundOrg(uint oid) public payable {
        require(msg.value > 0 ether, "Insufficient amount");
        organizations[oid].balance += msg.value;
    }

    function withdrawlFrom(
        uint oid,
        address account,
        uint amount
    ) public payable {
        require(organizations[oid].id != 0, "Organization not found");
        require(
            organizations[oid].account == msg.sender,
            "Unauthorized entity"
        );
        require(account != address(0), "Account must not be empty");
        require(
            amount > 0 ether && organizations[oid].cuts >= amount,
            "Insufficient amount"
        );
        payTo(account, amount);
        organizations[oid].cuts -= amount;
    }

    function payTo(address to, uint amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        if (!success) revert("Payment failed");
    }

    function currentTime() internal view returns (uint) {
        return (block.timestamp * 1000) + 1000;
    }
}
