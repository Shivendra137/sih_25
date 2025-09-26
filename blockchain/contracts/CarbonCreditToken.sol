// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
interface IMRVAnchor {
    function isAnchored(bytes32 _reportHash) external view returns (bool);
}
contract CarbonCreditToken is ERC20, AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    IMRVAnchor public immutable mrvAnchorContract;
    mapping(bytes32 => bool) public hasBeenMinted;
    event CreditRetired(address indexed owner, uint256 amountInTonnes, string reason);
    constructor(address _anchorContractAddress) ERC20("Blue Carbon Credit", "BCC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        mrvAnchorContract = IMRVAnchor(_anchorContractAddress);
    }
    function mintCredits(address projectOwner, uint256 amountInTonnes, bytes32 reportHash) public onlyRole(VERIFIER_ROLE) {
        require(mrvAnchorContract.isAnchored(reportHash), "Token: Proof is not anchored");
        require(!hasBeenMinted[reportHash], "Token: Credits already minted for this report");
        hasBeenMinted[reportHash] = true;
        uint256 amountToMint = amountInTonnes * (10**decimals());
        _mint(projectOwner, amountToMint);
    }
    function retire(uint256 amountInTonnes, string memory reason) public {
        uint256 amountToBurn = amountInTonnes * (10**decimals());
        _burn(msg.sender, amountToBurn);
        emit CreditRetired(msg.sender, amountInTonnes, reason);
    }
}
