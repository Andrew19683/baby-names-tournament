export function exportData() {
  const names = JSON.parse(localStorage.getItem("names")) || [];
  const matches = JSON.parse(localStorage.getItem("matches")) || undefined;
  const lastPlayedDate = localStorage.getItem("lastPlayedDate") || undefined;
  const todayCount = localStorage.getItem("todayCount") || undefined;

  const result = { names: names };
  if (matches) {
    result.matches = matches;
  }
  if (lastPlayedDate) {
    result.lastPlayedDate = lastPlayedDate;
  }
  if (todayCount) {
    result.todayCount = todayCount;
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

export function importData(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);
      if (data.names) {
        localStorage.setItem("names", JSON.stringify(data.names));
      }
      if (data.matches) {
        localStorage.setItem("matches", JSON.stringify(data.matches));
      }
      if (data.lastPlayedDate) {
        localStorage.setItem("lastPlayedDate", data.lastPlayedDate);
      }
      if (data.todayCount) {
        localStorage.setItem("todayCount", data.todayCount);
      }
      alert("Данные успешно импортированы!");
      location.reload();
    } catch (error) {
      alert("Ошибка при импорте данных: " + error.message);
    }
  };
  reader.readAsText(file);
}
