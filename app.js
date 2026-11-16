// Modul EDITOR - tvorba questu a export do quest.json
document.getElementById('quest-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const questData = {
    format: "qrq-1",
    id: document.getElementById('quest-id').value.trim(),
    title: document.getElementById('quest-title').value.trim(),
    intro: document.getElementById('quest-intro').value.trim(),
    mode: document.getElementById('quest-mode').value,
    floors: [],
    stations: []
  };

  const jsonString = JSON.stringify(questData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quest.json";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});