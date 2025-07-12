function setExample(equation) {
  document.getElementById("equation").value = equation;
}

function selectMethod(method) {
  alert(`Selected method: ${method}`);
  // You can add logic to visualize or calculate the selected method
}

function toggleExplanation(id) {
  const section = document.getElementById(id);
  const parent = section.closest(".explanation");

  if (parent.classList.contains("open")) {
    parent.classList.remove("open");
  } else {
    document.querySelectorAll(".explanation").forEach(el => el.classList.remove("open"));
    parent.classList.add("open");
  }
}
