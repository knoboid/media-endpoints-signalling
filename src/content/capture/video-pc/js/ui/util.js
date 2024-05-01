export function appendContentTo(parent, type, content) {
  const element = document.createElement(type);
  element.innerHTML = content;
  parent.appendChild(element);
  return element;
}
