// Workout Class: Represents a single logged exercise
class Workout {
    constructor(split, exercise, weight, sets, reps) {
        this.split = split;
        this.exercise = exercise;
        this.weight = weight;
        this.sets = sets;
        this.reps = reps;
        this.id = Date.now().toString();
    }
}

// UI Class: Handles HTML modifications
class UI {
    static displayWorkouts() {
        const workouts = Store.getWorkouts();
        workouts.forEach((workout) => UI.addWorkoutToList(workout));
    }

    static addWorkoutToList(workout) {
        const list = document.getElementById('workout-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${workout.split}</td>
            <td>${workout.exercise}</td>
            <td>${workout.weight} kg</td>
            <td>${workout.sets} x${workout.reps}</td>
            <td><button class="delete-btn" data-id="${workout.id}">X</button></td>
        `;
        list.appendChild(row);
    }

    static deleteWorkout(element) {
        if (element.classList.contains('delete-btn')) {
            element.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.getElementById('exercise').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('sets').value = '';
        document.getElementById('reps').value = '';
    }
}

// Store Class: Handles Browser Local Storage
class Store {
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static addWorkout(workout) {
        const workouts = Store.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Store.getWorkouts();
        const updatedWorkouts = workouts.filter(workout => workout.id !== id);
        localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    }
}

// Event: Display Workouts on Load
document.addEventListener('DOMContentLoaded', UI.displayWorkouts);

// Event: Add a Workout
document.getElementById('workout-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const split = document.getElementById('split').value;
    const exercise = document.getElementById('exercise').value;
    const weight = document.getElementById('weight').value;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;

    // Instantiate workout object
    const workout = new Workout(split, exercise, weight, sets, reps);

    // Add to UI
    UI.addWorkoutToList(workout);

    // Add to Local Storage
    Store.addWorkout(workout);

    // Clear form fields
    UI.clearFields();
});

// Event: Remove a Workout
document.getElementById('workout-list').addEventListener('click', (e) => {
    // Remove from UI
    UI.deleteWorkout(e.target);

    // Remove from Local Storage (using the data-id we embedded in the button)
    if(e.target.classList.contains('delete-btn')) {
        Store.removeWorkout(e.target.getAttribute('data-id'));
    }
});