/**
 * Information about user
 * @typedef {object} UserInfo
 * @property {boolean} isAdmin
 * @property {string} username
 * @property {string} tag
 */

import { cities } from "../constants/cities.js";


/**
 * 
 * @param {UserInfo} user 
 * @returns Node
 */
export function createUserMiniCard(user) {
  const element = document.createElement("div");

  element.classList.add(
    "relative",
    "px-3",
    "py-2",
    "flex",
    "align-items-center",
    "surface-card",
    "px-3",
    "py-2",
    "border-round-xl",
    "shadow-3",
    "hover:surface-hover"
  );

  const image = document.createElement("img");
  image.src = "https://gta-journal.ru/" + user.avatar;
  image.classList.add("border-circle", "mr-2");
  image.loading = "lazy";
  element.appendChild(image);

  const nickname = document.createElement("div");
  nickname.classList.add("flex", "align-items-center", "z-2");
  const tag = document.createElement("span");
  tag.innerText = user.tag;
  tag.classList.add(
    "z-1",
    "absolute",
    "p-1",
    "border-round-md",
    "text-sm",
    "font-bold",
    "mr-1",
    "select-none"
  );

  const cityColor = cities.find((city) => user.tag.includes(city.tag))?.color || "--text-color";
  tag.setAttribute("style", `top: 1px; right: 1px;opacity: 0.7;color: var(${cityColor})`);
  element.appendChild(tag);
  const nicknameContent = document.createElement("span");
  nicknameContent.innerText = user.username;
  nicknameContent.classList.add("font-bold", "select-all");
  if (user.isAdmin)
    nicknameContent.classList.add("text-orange-500");
  nickname.appendChild(nicknameContent);
  element.appendChild(nickname);

  return element;
} 
