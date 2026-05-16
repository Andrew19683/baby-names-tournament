export function exportData() {
  const names = JSON.parse(localStorage.getItem("names")) || [];
  const matches = JSON.parse(localStorage.getItem("matches")) || undefined;

  const result = { names: names };
  if (matches) {
    result.matches = matches;
  }
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(result));

  const downloadAnchor = document.createElement("a");

  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "tournament-data.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
