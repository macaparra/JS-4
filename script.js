document.addEventListener("DOMContentLoaded", function() {
  var activitiesContainer = document.getElementById("activities-container");
  var activitiesList = document.getElementById("activities-list");

  var storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
  if (storedActivities.length === 0) {
    loadActivities();
  } else {
    displayActivities(storedActivities);
  }

  var activityForm = document.getElementById("activity-form");
  activityForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    var titleInput = document.getElementById("title");
    var descriptionInput = document.getElementById("description");
    var title = titleInput.value;
    var description = descriptionInput.value;

    addActivity(title, description);

    titleInput.value = "";
    descriptionInput.value = "";
  });


  function updateLocalStorage(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
  }

  // AJAX
  function loadActivities() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "api/actividades.json", true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var activities = JSON.parse(xhr.responseText);
        displayActivities(activities);
        updateLocalStorage(activities); // Almacenar actividades en el almacenamiento local
      }
    };
    xhr.send();
  }

  function displayActivities(activities) {
    activitiesList.innerHTML = "";

    activities.forEach(function(activity) {
      var listItem = document.createElement("li");
      listItem.innerHTML = "<strong>" + activity.titulo + ":</strong> " +  "<br>" + activity.descripcion +  "<br><br>";

      var editButton = document.createElement("button-modify");
      editButton.innerText = "Modificar";
      editButton.addEventListener("click", function() {
        var newTitle = prompt("Nuevo título:", activity.titulo);
        var newDescription = prompt("Nueva descripción:", activity.descripcion);

        if (newTitle && newDescription) {
          activity.titulo = newTitle;
          activity.descripcion = newDescription;
          displayActivities(activities);
          updateLocalStorage(activities); 
        }
      });
      listItem.appendChild(editButton);

      var deleteButton = document.createElement("button-delete");
      deleteButton.innerText = "Eliminar";
      deleteButton.addEventListener("click", function() {
        var confirmDelete = confirm("¿Estás seguro de eliminar esta actividad?");

        if (confirmDelete) {
          activities.splice(activities.indexOf(activity), 1);
          displayActivities(activities);
          updateLocalStorage(activities);
        }
      });
      listItem.appendChild(deleteButton);

      activitiesList.appendChild(listItem);
    });
  }

  function addActivity(title, description) {
    var newActivity = {
      "titulo": '📌'+title,
      "descripcion": description
    };

    var activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(newActivity);

    displayActivities(activities);
    updateLocalStorage(activities);
  }

});
