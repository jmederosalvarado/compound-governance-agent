import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import { COMPOUND_GOVERNANCE_ADDRESS, SIGS, TOPICS } from "./utils";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  const targets = [TOPICS.CREATE, TOPICS.VOTE, TOPICS.EXECUTE];
  for (const event of targets) {
    const logs = txEvent.filterEvent(SIGS[event], COMPOUND_GOVERNANCE_ADDRESS);

    if (!logs.length) continue;

    if (txEvent.status) {
      findings.push(
        Finding.fromObject({
          name: "COMPOUND GOVERNANCE EVENT",
          description: `Compound ${event} Proposal Event detected.`,
          alertId: "COMPOUND_GOV_ALERT",
          protocol: "Compound",
          type: FindingType.Info,
          severity: FindingSeverity.Info,
        })
      );
    } else {
      findings.push(
        Finding.fromObject({
          name: "COMPOUND GOVERNANCE EVENT",
          description: `Compound Failed ${event} Proposal event detected.`,
          alertId: "COMPOUND_GOV_ALERT",
          protocol: "Compound",
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        })
      );
    }
  }

  return findings;
};

export default {
  handleTransaction,
};
