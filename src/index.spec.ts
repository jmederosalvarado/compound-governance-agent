import {
  EventType,
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  Network,
  TransactionEvent,
} from "forta-agent";
import agent from ".";
import { COMPOUND_GOVERNANCE_ADDRESS, SIGS, TOPICS } from "./utils";
import keccak256 from "keccak256";

export const generateHash = (signature: string): string => {
  const hash = keccak256(signature).toString("hex");
  return "0x" + hash;
};

describe("Detect Compound Governance Event", () => {
  let handleTransaction: HandleTransaction;

  const createTxEvent = ({
    logs,
    addresses,
    status = true,
  }: any): TransactionEvent => {
    const tx: any = {};
    const receipt: any = { logs, status };
    const block: any = {};
    const address: any = { ...addresses };

    return new TransactionEvent(
      EventType.BLOCK,
      Network.MAINNET,
      tx,
      receipt,
      [],
      address,
      block
    );
  };

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("Handle Transaction", () => {
    it("should return empty finding", async () => {
      const GovEvent = {
        topics: [],
        address: COMPOUND_GOVERNANCE_ADDRESS,
      };
      const txEvent = createTxEvent({
        logs: [GovEvent],
      });
      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it("should return empty finding - wrong address", async () => {
      const topicHash: string = generateHash(SIGS[TOPICS.CREATE]);

      const GovEvent = {
        topics: [topicHash],
        address: "0x05",
      };
      const txEvent = createTxEvent({
        logs: [GovEvent],
      });
      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it("should return empty finding - empty address", async () => {
      const topicHash: string = generateHash(SIGS[TOPICS.CREATE]);

      const GovEvent = {
        topics: [topicHash],
        address: "",
      };
      const txEvent = createTxEvent({
        logs: [GovEvent],
      });
      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it("should return CREATE Proposal Event finding in multiple Logs", async () => {
      const topicHash: string = generateHash(SIGS[TOPICS.CREATE]);

      const GovEvent = {
        topics: [topicHash],
        address: COMPOUND_GOVERNANCE_ADDRESS,
      };

      const anotherEvent = {
        topics: [],
        address: COMPOUND_GOVERNANCE_ADDRESS,
      };
      const txEvent = createTxEvent({
        logs: [anotherEvent, GovEvent],
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "COMPOUND GOVERNANCE EVENT",
          description: `Compound ${TOPICS.CREATE} Proposal Event detected.`,
          alertId: "COMPOUND_GOV_ALERT",
          protocol: "Compound",
          type: FindingType.Info,
          severity: FindingSeverity.Info,
        }),
      ]);
    });

    it("should return empty finding in because of wrong address", async () => {
      const topicHash: string = generateHash(SIGS[TOPICS.VOTE]);

      const GovEvent = {
        topics: [topicHash],
        address: "0x02",
      };

      const anotherEvent = {
        topics: [],
        address: COMPOUND_GOVERNANCE_ADDRESS,
      };
      const txEvent = createTxEvent({
        logs: [anotherEvent, GovEvent],
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    describe("Successed Gov Transactions", () => {
      it("should return CREATE Proposal Event finding", async () => {
        const topicHash: string = generateHash(SIGS[TOPICS.CREATE]);

        const GovEvent = {
          topics: [topicHash],
          address: COMPOUND_GOVERNANCE_ADDRESS,
        };
        const txEvent = createTxEvent({
          logs: [GovEvent],
        });

        const findings = await handleTransaction(txEvent);

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "COMPOUND GOVERNANCE EVENT",
            description: `Compound ${TOPICS.CREATE} Proposal Event detected.`,
            alertId: "COMPOUND_GOV_ALERT",
            protocol: "Compound",
            type: FindingType.Info,
            severity: FindingSeverity.Info,
          }),
        ]);
      });

      it("should return VOTE Proposal Event finding", async () => {
        const topicHash: string = generateHash(SIGS[TOPICS.VOTE]);

        const GovEvent = {
          topics: [topicHash],
          address: COMPOUND_GOVERNANCE_ADDRESS,
        };
        const txEvent = createTxEvent({
          logs: [GovEvent],
        });

        const findings = await handleTransaction(txEvent);

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "COMPOUND GOVERNANCE EVENT",
            description: `Compound ${TOPICS.VOTE} Proposal Event detected.`,
            alertId: "COMPOUND_GOV_ALERT",
            protocol: "Compound",
            type: FindingType.Info,
            severity: FindingSeverity.Info,
          }),
        ]);
      });


      it("should return EXECUTE Proposal Event finding", async () => {
        const topicHash: string = generateHash(SIGS[TOPICS.EXECUTE]);

        const GovEvent = {
          topics: [topicHash],
          address: COMPOUND_GOVERNANCE_ADDRESS,
        };
        const txEvent = createTxEvent({
          logs: [GovEvent],
        });

        const findings = await handleTransaction(txEvent);

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "COMPOUND GOVERNANCE EVENT",
            description: `Compound ${TOPICS.EXECUTE} Proposal Event detected.`,
            alertId: "COMPOUND_GOV_ALERT",
            protocol: "Compound",
            type: FindingType.Info,
            severity: FindingSeverity.Info,
          }),
        ]);
      });

    });

    describe("Failed Gov Transactions", () => {
      it("should return Failed CREATE Proposal Event finding", async () => {
        const topicHash: string = generateHash(SIGS[TOPICS.CREATE]);

        const GovEvent = {
          topics: [topicHash],
          address: COMPOUND_GOVERNANCE_ADDRESS,
        };
        const txEvent = createTxEvent({
          logs: [GovEvent],
          status: false,
        });

        const findings = await handleTransaction(txEvent);

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "COMPOUND GOVERNANCE EVENT",
            description: `Compound Failed ${TOPICS.CREATE} Proposal event detected.`,
            alertId: "COMPOUND_GOV_ALERT",
            protocol: "Compound",
            type: FindingType.Suspicious,
            severity: FindingSeverity.High,
          }),
        ]);
      });

      it("should return Failed VOTE Proposal Event finding", async () => {
        const topicHash: string = generateHash(SIGS[TOPICS.VOTE]);

        const GovEvent = {
          topics: [topicHash],
          address: COMPOUND_GOVERNANCE_ADDRESS,
        };
        const txEvent = createTxEvent({
          logs: [GovEvent],
          status: false,
        });

        const findings = await handleTransaction(txEvent);

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "COMPOUND GOVERNANCE EVENT",
            description: `Compound Failed ${TOPICS.VOTE} Proposal event detected.`,
            alertId: "COMPOUND_GOV_ALERT",
            protocol: "Compound",
            type: FindingType.Suspicious,
            severity: FindingSeverity.High,
          }),
        ]);
      });


      it("should return Failed EXECUTE Proposal Event finding", async () => {
        const topicHash: string = generateHash(SIGS[TOPICS.EXECUTE]);

        const GovEvent = {
          topics: [topicHash],
          address: COMPOUND_GOVERNANCE_ADDRESS,
        };
        const txEvent = createTxEvent({
          logs: [GovEvent],
          status: false,
        });

        const findings = await handleTransaction(txEvent);

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "COMPOUND GOVERNANCE EVENT",
            description: `Compound Failed ${TOPICS.EXECUTE} Proposal event detected.`,
            alertId: "COMPOUND_GOV_ALERT",
            protocol: "Compound",
            type: FindingType.Suspicious,
            severity: FindingSeverity.High,
          }),
        ]);
      });

    });
  });
});
