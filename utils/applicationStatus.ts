export enum ApplicationStatus  {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELED = 3,
  ADDITIONAL_1 = 4,
  ADDITIONAL_2 = 5,
  ADDITIONAL_3 = 6,
  ADDITIONAL_4 = 7,
  ADDITIONAL_5 = 8,
  ADDITIONAL_6 = 9,
  ADDITIONAL_7 = 10,
  ADDITIONAL_8 = 11,
  ADDITIONAL_9 = 12,
  ADDITIONAL_10 = 13,
  ADDITIONAL_11 = 14,
  ADDITIONAL_12 = 15,
};

export function buildStatusRow(
  currentRow: bigint,
  statuses: {index: number, status: ApplicationStatus}[]
) {
  let newRow = currentRow;

  for (let i = 0; i < statuses.length; i++) {
    if(statuses[i].index >= 64) {
      throw new Error(`Status with column index ${statuses[i].index} is out of bounds`);
    }

    const columnIndex = BigInt(statuses[i].index) * 4n;
    const status = BigInt(statuses[i].status);

    // build a mask and clear the previous status of this index
    newRow = newRow & ~(15n << columnIndex);
    // set the new status
    newRow = newRow | status << columnIndex;
  }

  return newRow.toString();
};
