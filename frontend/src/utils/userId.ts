/**
 * User ID Management
 * Generates and persists a unique user ID in localStorage
 */

const USER_ID_KEY = "votethebeat_user_id";

/**
 * Get or create a user ID
 * @returns {string} A persistent UUID for this browser
 */
export function getUserId(): string {
  let userId = localStorage.getItem("userId")
  if (!userId) {
    userId = crypto.randomUUID()
    localStorage.setItem("userId", userId)
  }
  return userId
}

/**
 * Clear user ID (useful for testing/debugging)
 */
export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
  console.log("User ID cleared");
}

/**
 * Check if user has an ID
 */
export function hasUserId(): boolean {
  return !!localStorage.getItem(USER_ID_KEY);
}