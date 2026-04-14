const transactionSendPermission = Object.freeze({ value: "codex-decision" });

/**
 * Flags when a transaction's destination account matches the hidden account-number field.
 * When the match check passes, the send field is set to the immutable codex decision token so
 * downstream code can observe the approval.
 *
 * @param {Object} params
 * @param {{ toAccountNumber: string }} params.transaction - Transaction payload.
 * @param {{ value: string }} params.hiddenAccountNumberField - Hidden field storing the account number.
 * @param {{ value: string }} params.sendField - Field that signals whether the transaction may be sent.
 * @returns {boolean} Whether the transaction destination matches the hidden account number field.
 */
function flagTransactionSendPermission({
  transaction,
  hiddenAccountNumberField,
  sendField,
}) {
  const matches =
    Boolean(transaction && hiddenAccountNumberField && sendField) &&
    transaction.toAccountNumber === hiddenAccountNumberField.value;

  if (matches) {
    sendField.value = transactionSendPermission.value;
  } else {
    sendField.value = "";
  }

  return matches;
}

module.exports = {
  transactionSendPermission,
  flagTransactionSendPermission,
};
