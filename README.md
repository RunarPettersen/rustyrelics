# rustyrelics

Rusty Relics is an online auction house where users can create listings, bid on items, and browse available auctions. This project is built using HTML, CSS, JavaScript, and Tailwind CSS, and it interacts with the Noroff API to manage auction listings and user profiles.

## Live Demo
[Visit the live demo](https://rustyrelics.netlify.app/)

## Repository
[GitHub Repository](https://github.com/RunarPettersen/rustyrelics)

## Prerequisites
- Node.js (version 14 or higher)
- Tailwind CSS (via npm)
- Prettier (for code formatting)
- ESlint (For testing)

## Installation
1. Clone the repository:
   git clone https://github.com/yourusername/rustyrelics.git
2. Navigate to the project directory:
   cd rustyrelics
3. Install dependencies:
   npm install
4. Run the development environment:
   npm run dev

## Linting with ESLint
I use ESLint to maintain code quality and consistency.

Run ESLint
To check for linting errors, run:
1. npx eslint

To automatically fix errors, run:
2. npx eslint . --fix

## PrettierInstallation
If you don't have Prettier installed globally:

1. npm install --save-dev prettier

### Usage
To format all project files:
1. npx prettier --write .

To format a single file:
2. npx prettier --write path/to/file.js

### Usage of Webpage
Home Page: Information and latest listings
Auctions: Browse the available auctions.
Create Auction: Add a new auction to the platform.
Auction Details: View item details and place bids.
Profile Page: Manage your listings and personal information.