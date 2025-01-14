// Sayfa yüklendiğinde localStorage'den verileri yükle
window.onload = function() {
    loadHabits();
    createTargetInputs();
  };
  
  // Hedef inputlarını dinamik olarak oluştur
  function createTargetInputs() {
    const targetsDiv = document.getElementById("targets");
    targetsDiv.innerHTML = ""; // Önceki inputları temizle
  
    for (let i = 1; i <= 13; i++) {
      const targetLabel = document.createElement("label");
      targetLabel.textContent = i + ". 28 Günlük Hedef:";
      const targetInput = document.createElement("input");
      targetInput.type = "text";
      targetInput.id = "target" + i;
      targetInput.name = "target" + i;
  
      targetsDiv.appendChild(targetLabel);
      targetsDiv.appendChild(targetInput);
      targetsDiv.appendChild(document.createElement("br"));
    }
  }
  
  // İlk hedefi diğer hedef inputlarına kopyala
  document.getElementById("initialGoal").addEventListener("input", function() {
    const initialGoal = this.value;
    for (let i = 1; i <= 13; i++) {
      document.getElementById("target" + i).value = initialGoal;
    }
  });
  
  // Yeni alışkanlık formu gönderildiğinde
  document.getElementById("habitForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const habitName = document.getElementById("habitName").value;
    const initialGoal = document.getElementById("initialGoal").value;
    const targets = [];
    for (let i = 1; i <= 13; i++) {
      targets.push(document.getElementById("target" + i).value);
    }
  
    saveHabit(habitName, initialGoal, targets);
  
    this.reset();
    // Formu gizlemek için gerekli kodları buraya ekleyin (örneğin, form.style.display = "none";)
  
    loadHabits();
  });
  
  // Alışkanlıkları localStorage'e kaydet
  function saveHabit(habitName, initialGoal, targets) {
    let habits = JSON.parse(localStorage.getItem("habits")) || {};
    habits[habitName] = { initialGoal: initialGoal, targets: targets, days: {} };
    localStorage.setItem("habits", JSON.stringify(habits));
  }
  
  // Alışkanlıkları localStorage'den yükle
  function loadHabits() {
    const habitList = document.getElementById("habitList");
    habitList.innerHTML = "";
  
    const habits = JSON.parse(localStorage.getItem("habits")) || {};
    for (const habitName in habits) {
      const habitItem = document.createElement("li");
      habitItem.textContent = habitName;
      habitItem.addEventListener("click", function() {
        createHabitTable(habitName); // habitName parametresini ekledik
      });
      habitList.appendChild(habitItem);
    }
  }
  
  // Alışkanlık tablosunu oluştur
  function createHabitTable(habitName) {
    const habits = JSON.parse(localStorage.getItem("habits")) || {};
    const habit = habits[habitName];
  
    const table = document.createElement("table");
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = "Gün";
  
    // Döngüleri buraya taşıdık
    for (let i = 1; i <= 13; i++) {
      const periodHeader = headerRow.insertCell();
      periodHeader.colSpan = 28;
      periodHeader.textContent = i + ". Dönem - " + habit.targets[i - 1]; // Hedefi başlığa ekle (düzeltildi)
    }
  
    const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    let dayCounter = 1;
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 4; j++) {
          const weekRow = table.insertRow();
          for (let k = 0; k < 7; k++) {
          const dayCell = weekRow.insertCell();
          dayCell.textContent = dayCounter + " " + days[k];
          dayCell.addEventListener("click", (function(day) { // Closure ekledik
            return function() {
              markDay(habitName, day);
            }
          })(dayCounter)); // dayCounter değerini closure'a ilettik
  
          const today = new Date();
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          const diff = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
          const currentDay = diff + 1;
  
          if (dayCounter < currentDay) {
            dayCell.classList.add("missed");
          } else if (dayCounter === currentDay) {
            dayCell.classList.add("today");
          } else {
            dayCell.classList.add("disabled");
          }
  
          if (habit.days[dayCounter]) {
            dayCell.classList.add("completed");
            dayCell.classList.remove("missed");
          } else if (dayCounter < currentDay) {
            dayCell.classList.add("missed");
          }
  
          dayCounter++;
        }
      }
    }
  
    const habitList = document.getElementById("habitList");
    const existingTable = habitList.querySelector("table");
    if (existingTable) {
      habitList.removeChild(existingTable);
    }
    habitList.appendChild(table);
  }
  
  // Gün işaretleme fonksiyonu
  function markDay(habitName, day) {
    const habits = JSON.parse(localStorage.getItem("habits")) || {};
    const habit = habits[habitName];
  
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diff = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    const currentDay = diff + 1;
  
    if (day === currentDay) {
      habit.days[day] = !habit.days[day]; // Değeri tersine çevirerek güncelle
      localStorage.setItem("habits", JSON.stringify(habits));
      createHabitTable(habitName);
    }
  }

  