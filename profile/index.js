const ProfileDescription_display = document.getElementById("BioTextArea");
ProfileDescription_display.setAttribute("disabled", "disabled");

function showProfileDescription() {
  document.querySelector(".section__div--buttons").style.display = "flex";
  ProfileDescription_display.removeAttribute("disabled", "");
}

document.querySelector("button#buttonSave").addEventListener("click", function () {
  document.querySelector(".section__div--buttons").style.display = "none";
  ProfileDescription_display.setAttribute("disabled", "disabled");
});
document.querySelector("button#buttonCancel").addEventListener("click", function () {
  document.querySelector(".section__div--buttons").style.display = "none";
  ProfileDescription_display.setAttribute("disabled", "disabled");
});