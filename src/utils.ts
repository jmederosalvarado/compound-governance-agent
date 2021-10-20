export const COMPOUND_GOVERNANCE_ADDRESS =
  "0xc0dA01a04C3f3E0be433606045bB7017A7323E38";

// An event emitted when a new proposal is created
export const PROPOSAL_CREATE_SIGNATURE =
  "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)";

// An event emitted when a vote has been cast on a proposal
export const PROPOSAL_VOTE_CAST_SIGNATURE =
  "VoteCast(address,uint256,bool,uint256)";

// An event emitted when a proposal has been canceled
export const PROPOSAL_CANCEL_SIGNATURE = "ProposalCanceled(uint256)";

// An event emitted when a proposal has been queued
export const PROPOSAL_QUEUED_SIGNATURE = "ProposalQueued(uint256,uint256)";

// An event emitted when a proposal has been executed
export const PROPOSAL_EXECUTED_SIGNATURE = "ProposalExecuted(uint256)";

export enum TOPICS {
  CREATE = "CREATE",
  VOTE = "VOTE",
  QUEUE = "QUEUE",
  EXECUTE = "EXECUTE",
  CANCEL = "CANCEL",
}

export const SIGS = {
  [TOPICS.CREATE]: PROPOSAL_CREATE_SIGNATURE,
  [TOPICS.VOTE]: PROPOSAL_VOTE_CAST_SIGNATURE,
  [TOPICS.QUEUE]: PROPOSAL_QUEUED_SIGNATURE,
  [TOPICS.EXECUTE]: PROPOSAL_EXECUTED_SIGNATURE,
  [TOPICS.CANCEL]: PROPOSAL_CANCEL_SIGNATURE,
};
