import type { Name, Matches, Descriptions, ImportResult } from "./types.js";

export function exportData() {
  const names: Name[] = JSON.parse(localStorage.getItem("names")!) || [];
  const matches: Matches | undefined =
    JSON.parse(localStorage.getItem("matches") ?? "null") ?? undefined;
  const lastPlayedDate: string | undefined =
    localStorage.getItem("lastPlayedDate") || undefined;
  const todayCount: string | undefined =
    localStorage.getItem("todayCount") || undefined;
  const descriptions: Descriptions =
    JSON.parse(localStorage.getItem("descriptions") ?? "null") || {};

  const result: ImportResult = { names: names };
  if (matches) {
    result.matches = matches;
  }
  if (lastPlayedDate) {
    result.lastPlayedDate = lastPlayedDate;
  }
  if (todayCount) {
    result.todayCount = todayCount;
  }
  if (descriptions) {
    result.descriptions = descriptions;
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

export function importData(file: File) {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const result = event.target?.result;
      const data = JSON.parse(typeof result === "string" ? result : "null");
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
      if (data.descriptions) {
        localStorage.setItem("descriptions", JSON.stringify(data.descriptions));
      }
      alert("Данные успешно импортированы!");
      location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Ошибка при импорте данных: " + error.message);
      }
    }
  };
  reader.readAsText(file);
}
