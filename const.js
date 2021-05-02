const TOKEN_HEADERS = {
  ADMIN_TOKEN_HEADER: "admin-auth-header",
  USER_TOKEN_HEADER: "user-auth-header",
};

const BECOME_A_SELLER_STATUSES = {
  BECOME_A_SELLER_STATUS_NOT: "not-a-seller",
  BECOME_A_SELLER_STATUS_PENDING: "seller-application-pending",
  BECOME_A_SELLER_STATUS_REJECTED: "seller-application-rejected",
  BECOME_A_SELLER_STATUS_ACCEPTED: "seller-application-accepted",
};

// const CATEGORY_IDS = {
//   ACTION: 1,
//   SPORTS: 2,
//   OTHERS: 3,
// };

// module.exports.categoryIds = CATEGORY_IDS;
module.exports.tokenHeaders = TOKEN_HEADERS;
module.exports.becomeASellerStatuses = BECOME_A_SELLER_STATUSES;
