pragma solidity ^0.8.28;
contract MRVAnchor{
    struct ReportRecord{
        bytes32 reportHash;
        string ipfsCID;
        uint256 timestamp;
        address anchoredBy;
        string missionId;
    }
    mapping(bytes32 => ReportRecord) public records;
    event ReportAnchored(
        bytes32 indexed reportHash,
        string ipfsCid,
        string missionId,
        address indexed anchorer,
        uint256 timestamp
    );
    function anchor(bytes32 _reportHash, string memory _ipfsCid, string memory _missionId) public {
        require(records[_reportHash].timestamp == 0, "Report already anchored");
        records[_reportHash] = ReportRecord({
            reportHash: _reportHash,
            ipfsCID: _ipfsCid,
            timestamp: block.timestamp,
            anchoredBy: msg.sender,
            missionId: _missionId
        });
        emit ReportAnchored(_reportHash, _ipfsCid, _missionId, msg.sender, block.timestamp);
    }
    function isAnchored(bytes32 _reportHash) public view returns (bool) {
        return records[_reportHash].timestamp != 0;
    }
    function getRecord(bytes32 _reportHash) public view returns (ReportRecord memory) {
        require(records[_reportHash].timestamp != 0, "MRVAnchor: Report not found");
        return records[_reportHash];
    }
}