const form = document.getElementById("update-form");

console.log('hello')
form.addEventListener("change", () => {
  console.log('change')
  const updateBtn = document.querySelector("button[type='submit']");
  updateBtn.removeAttribute("disabled");
});