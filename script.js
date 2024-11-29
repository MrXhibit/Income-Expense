const form = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const entryList = document.getElementById("entry-list");
const resetBtn = document.getElementById("reset-btn");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const netBalance = document.getElementById("net-balance");
const filters = document.querySelectorAll(".filters input");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

const updateSummary = () => {
  const income = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expenses = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  totalIncome.textContent = income.toFixed(2);
  totalExpenses.textContent = expenses.toFixed(2);
  netBalance.textContent = (income - expenses).toFixed(2);
};

const renderEntries = (filter = "all") => {
  entryList.innerHTML = "";
  const filteredEntries =
    filter === "all" ? entries : entries.filter((e) => e.type === filter);
  filteredEntries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${entry.description}</span>
      <span>${entry.type === "income" ? "+" : "-"}$${entry.amount.toFixed(
      2
    )}</span>
      <span>
        <button class="edit" onclick="editEntry(${index})">Edit</button>
        <button class="delete" onclick="deleteEntry(${index})">Delete</button>
      </span>
    `;
    entryList.appendChild(li);
  });
};

const saveEntries = () => {
  localStorage.setItem("entries", JSON.stringify(entries));
};

const addEntry = (entry) => {
  entries.push(entry);
  saveEntries();
  updateSummary();
  renderEntries();
};

const editEntry = (index) => {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  document.querySelector(
    `input[name="type"][value="${entry.type}"]`
  ).checked = true;
  deleteEntry(index);
};

const deleteEntry = (index) => {
  entries.splice(index, 1);
  saveEntries();
  updateSummary();
  renderEntries();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;
  if (!description || isNaN(amount)) return;

  addEntry({ description, amount, type });
  form.reset();
});

resetBtn.addEventListener("click", () => form.reset());

filters.forEach((filter) => {
  filter.addEventListener("change", (e) => renderEntries(e.target.value));
});

updateSummary();
renderEntries();
