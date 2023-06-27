export enum ApplicationStatus  {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELED = 3,
};

export function buildStatusRow(
  currentRow: bigint,
  statuses: {index: number, status: ApplicationStatus}[]
) {
  let newRow = currentRow;

  for (let i = 0; i < statuses.length; i++) {
    if(statuses[i].index >= 128) {
      throw new Error(`Status with column index ${statuses[i].index} is out of bounds`);
    }

    const columnIndex = BigInt(statuses[i].index) * 2n;
    const status = BigInt(statuses[i].status);

    // build a mask and clear the previous status of this index
    newRow = newRow & ~(3n << columnIndex);
    // set the new status
    newRow = newRow | status << columnIndex;
  }

  return newRow.toString();
};
