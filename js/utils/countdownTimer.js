/**
 * Starts a countdown timer and updates the provided badge element.
 * 
 * @param {HTMLElement} badge - The badge element to display the countdown.
 * @param {Date} endsAt - The end date and time of the auction.
 */
export function startCountdown(badge, endsAt) {
  let interval;

  const updateBadge = () => {
    const now = new Date();
    const diffMs = endsAt - now;

    if (diffMs <= 0) {
      badge.textContent = "Ended!";
      badge.classList.remove("bg-black/70");
      badge.classList.add("bg-red-600");
      clearInterval(interval);
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;

      if (diffHours < 24) {
        badge.textContent = `${diffHours}h ${remainingMinutes}m left`;
      } else {
        const diffDays = Math.ceil(diffHours / 24);
        badge.textContent = `${diffDays}d left`;
      }
    }
  };

  // Run it once to set the initial state
  updateBadge();

  // Initialize the interval after defining it, every second
  interval = setInterval(updateBadge, 1000);
}
