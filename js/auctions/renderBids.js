export function renderBids(bids, container, bidInput = null) {
  container.innerHTML = "";

  if (!bids.length) {
    const li = document.createElement("li");
    li.className = "text-gray-500";
    li.textContent = "No bids yet";
    container.appendChild(li);

    if (bidInput) {
      bidInput.value = 1;
    }

    return;
  }

  bids
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .forEach((bid) => {
      const li = document.createElement("li");
      li.className = "border-b pb-2";

      const bidder = document.createElement("p");
      bidder.innerHTML = `<strong>${bid.bidder.name}</strong> bid <span class="text-green-600">${bid.amount} credits</span>`;

      const date = document.createElement("p");
      date.className = "text-xs text-gray-500";
      date.textContent = new Date(bid.created).toLocaleString();

      li.append(bidder, date);
      container.appendChild(li);
    });

  if (bidInput) {
    const latestBid = bids[bids.length - 1];
    bidInput.value = latestBid.amount + 1;
  }
}
