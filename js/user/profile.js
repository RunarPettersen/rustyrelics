import { getToken, getUsername } from "../utils/auth.js";
import { loadProfile } from "./loadProfile.js";

const username = getUsername();
const token = getToken();

if (!username || !token) {
  window.location.href = "./login.html";
}

document.title = `${username}'s Profile | Rusty Relics`;

loadProfile(username);