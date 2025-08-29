document.addEventListener("DOMContentLoaded", function () {
    // Initialize elements
    const usernameElement = document.getElementById("username");
    const loginModal = document.getElementById("login-modal");
    const signupModal = document.getElementById("signup-modal");
    const navButtons = document.getElementById("nav-buttons");
    const userMenu = document.getElementById("user-menu");
    const profileDropdown = document.getElementById("profile-dropdown");
    const welcomeSection = document.getElementById("welcome");
    const dashboardSection = document.getElementById("dashboard");
    const onboardingSection = document.getElementById("onboarding");

    // Set default username if element exists
    if (usernameElement) {
        usernameElement.textContent = "Alex"; // Default name
    }

    // Check if user is already logged in
    function checkAuthStatus() {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            // Update UI for logged-in user
            navButtons.classList.add("hidden");
            userMenu.classList.remove("hidden");
            welcomeSection.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
            
            // Update username display
            if (usernameElement) {
                usernameElement.textContent = userData.username;
            }
            
            // Update dashboard stats to show any existing logged meals
            setTimeout(() => {
                updateDashboardStats();
            }, 100);
        }
    }

    // Check backend connectivity
    async function checkBackendStatus() {
        try {
            const response = await fetch('http://localhost:3001/api/health', { 
                method: 'GET',
                timeout: 5000 
            });
            return response.ok;
        } catch (error) {
            console.warn('Backend not accessible:', error);
            return false;
        }
    }

    // Initialize auth status check
    checkAuthStatus();

    // Modal Control Functions
    window.showLogin = function() {
        loginModal.classList.remove("hidden");
    };

    window.showSignup = function() {
        signupModal.classList.remove("hidden");
    };

    window.hideModals = function() {
        loginModal.classList.add("hidden");
        signupModal.classList.add("hidden");
        document.getElementById('meal-log-modal').classList.add("hidden");
        document.getElementById('workout-tracking-modal').classList.add("hidden");
        document.getElementById('six-day-split-modal').classList.add("hidden");
        document.getElementById('challenges-modal').classList.add("hidden");
        document.getElementById('achievements-modal').classList.add("hidden");
        document.getElementById('today-plan-modal').classList.add("hidden");
        document.getElementById('calories-modal').classList.add("hidden");
        document.getElementById('protein-modal').classList.add("hidden");
        document.getElementById('workouts-modal').classList.add("hidden");
    };

    // Close Modals When Clicking Outside
    window.onclick = function(event) {
        if (event.target === loginModal || event.target === signupModal || event.target === document.getElementById('meal-log-modal') || event.target === document.getElementById('workout-tracking-modal') || event.target === document.getElementById('six-day-split-modal') || event.target === document.getElementById('challenges-modal') || event.target === document.getElementById('achievements-modal') || event.target === document.getElementById('today-plan-modal') || event.target === document.getElementById('calories-modal') || event.target === document.getElementById('protein-modal') || event.target === document.getElementById('workouts-modal')) {
            hideModals();
        }
    };

    // Dropdown Toggle
    window.toggleDropdown = function() {
        profileDropdown.classList.toggle("hidden");
    };

    // Close Dropdown When Clicking Outside
    document.addEventListener("click", function(e) {
        if (!e.target.closest("#user-menu") && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.add("hidden");
        }
    });

    // Form Handlers
    window.handleLogin = async function(event) {
        event.preventDefault();
        
        // Get form elements
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const submitBtn = event.target.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!emailInput.value.trim() || !passwordInput.value.trim()) {
            alert('Please fill in all fields');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Update UI
                hideModals();
                navButtons.classList.add("hidden");
                userMenu.classList.remove("hidden");
                welcomeSection.classList.add("hidden");
                dashboardSection.classList.remove("hidden");
                
                // Update username display
                if (usernameElement) {
                    usernameElement.textContent = data.user.username;
                }
                
                // Update dashboard stats
                setTimeout(() => {
                    updateDashboardStats();
                }, 100);
                
                // Clear form
                document.getElementById('login-form').reset();
                
                console.log('Login successful:', data.message);
            } else {
                alert(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };

    window.handleSignup = async function(event) {
        event.preventDefault();
        
        // Get form elements
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const submitBtn = event.target.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value.trim()) {
            alert('Please fill in all fields');
            return;
        }
        
        if (passwordInput.value.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        const formData = {
            username: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Update UI
                hideModals();
                navButtons.classList.add("hidden");
                userMenu.classList.remove("hidden");
                welcomeSection.classList.add("hidden");
                onboardingSection.classList.remove("hidden");
                
                // Update username display
                if (usernameElement) {
                    usernameElement.textContent = data.user.username;
                }
                
                // Clear form
                document.getElementById('signup-form').reset();
                
                console.log('Signup successful:', data.message);
            } else {
                alert(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };

    window.handleLogout = function() {
        // Clear stored user data
        localStorage.removeItem('user');
        
        // Reset UI
        navButtons.classList.remove("hidden");
        userMenu.classList.add("hidden");
        dashboardSection.classList.add("hidden");
        onboardingSection.classList.add("hidden");
        welcomeSection.classList.remove("hidden");
        profileDropdown.classList.add("hidden");
        
        // Reset username to default
        if (usernameElement) {
            usernameElement.textContent = "Alex";
        }
        
        console.log('User logged out successfully');
    };

    // Onboarding Steps
    window.nextStep = function(currentStep) {
        document.getElementById("step-" + currentStep).classList.add("hidden");
        document.getElementById("step-" + (currentStep + 1)).classList.remove("hidden");
        document.getElementById("current-step").textContent = currentStep + 1;
        document.getElementById("progress-bar").style.width = ((currentStep + 1) * 20) + "%";
    };

    window.prevStep = function(currentStep) {
        document.getElementById("step-" + currentStep).classList.add("hidden");
        document.getElementById("step-" + (currentStep - 1)).classList.remove("hidden");
        document.getElementById("current-step").textContent = currentStep - 1;
        document.getElementById("progress-bar").style.width = ((currentStep - 1) * 20) + "%";
    };

    window.finishOnboarding = function() {
        document.getElementById("step-5").classList.add("hidden");
        document.getElementById("loading-state").classList.remove("hidden");
        
        setTimeout(function() {
            document.getElementById("loading-state").classList.add("hidden");
            onboardingSection.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
        }, 3000);
    };

    // Fitness Goal Selection
    window.selectOption = function(selectedInput) {
        document.querySelectorAll("[name='fitness-goal']").forEach(input => {
            input.parentElement.classList.remove("border-blue-600", "bg-blue-50");
        });
        selectedInput.parentElement.classList.add("border-blue-600", "bg-blue-50");
    };

    // Handle URL hash changes
    window.addEventListener("hashchange", function() {
        const hash = window.location.hash;
        if (hash === "#dashboard") {
            welcomeSection.classList.add("hidden");
            onboardingSection.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
        } else if (hash === "#onboarding") {
            welcomeSection.classList.add("hidden");
            dashboardSection.classList.add("hidden");
            onboardingSection.classList.remove("hidden");
        }
    });

    // Prevent Zooming with Ctrl + Scroll
    document.body.addEventListener("wheel", function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // Meal Logging Functions
    window.openMealLogModal = function(mealType, mealName, calories, protein, carbs, fat) {
        const modal = document.getElementById('meal-log-modal');
        const mealTypeInputs = document.querySelectorAll('input[name="meal-type"]');
        const mealNameInput = document.getElementById('meal-name');
        const mealTimeInput = document.getElementById('meal-time');
        const mealDateInput = document.getElementById('meal-date');
        const mealCaloriesInput = document.getElementById('meal-calories');
        const mealProteinInput = document.getElementById('meal-protein');
        const mealCarbsInput = document.getElementById('meal-carbs');
        const mealFatInput = document.getElementById('meal-fat');

        // Set current date and time
        const now = new Date();
        mealDateInput.value = now.toISOString().split('T')[0];
        mealTimeInput.value = now.toTimeString().slice(0, 5);

        // Pre-fill form if meal details are provided
        if (mealName && mealName !== '') {
            mealNameInput.value = mealName;
        }
        if (calories > 0) {
            mealCaloriesInput.value = calories;
        }
        if (protein > 0) {
            mealProteinInput.value = protein;
        }
        if (carbs > 0) {
            mealCarbsInput.value = carbs;
        }
        if (fat > 0) {
            mealFatInput.value = fat;
        }

        // Set meal type based on parameter
        if (mealType && mealType !== 'Custom') {
            mealTypeInputs.forEach(input => {
                if (input.value === mealType.toLowerCase()) {
                    input.checked = true;
                }
            });
        }

        // Set initial styling for selected meal type
        const selectedInput = document.querySelector('input[name="meal-type"]:checked');
        if (selectedInput) {
            const selectedLabel = selectedInput.closest('.meal-type-option');
            if (selectedLabel) {
                selectedLabel.classList.add('border-blue-600', 'bg-blue-50');
            }
        }

        modal.classList.remove('hidden');
    };

    window.hideMealLogModal = function() {
        const modal = document.getElementById('meal-log-modal');
        modal.classList.add('hidden');
        
        // Reset form
        document.getElementById('meal-log-form').reset();
        
        // Set current date and time again
        const now = new Date();
        document.getElementById('meal-date').value = now.toISOString().split('T')[0];
        document.getElementById('meal-time').value = now.toTimeString().slice(0, 5);
    };

    window.handleMealLog = async function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const mealData = {
            type: formData.get('meal-type'),
            name: document.getElementById('meal-name').value,
            time: document.getElementById('meal-time').value,
            date: document.getElementById('meal-date').value,
            calories: parseInt(document.getElementById('meal-calories').value),
            protein: parseFloat(document.getElementById('meal-protein').value),
            carbs: parseFloat(document.getElementById('meal-carbs').value),
            fat: parseFloat(document.getElementById('meal-fat').value),
            notes: document.getElementById('meal-notes').value
        };

        try {
            // Store meal data in localStorage for now
            const existingMeals = JSON.parse(localStorage.getItem('loggedMeals') || '[]');
            existingMeals.push({
                ...mealData,
                id: Date.now(),
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('loggedMeals', JSON.stringify(existingMeals));

            // Show success message
            showMealLogSuccess(mealData);
            
            // Close modal
            hideMealLogModal();
            
            // Update dashboard stats if needed
            updateDashboardStats();
            
        } catch (error) {
            console.error('Error logging meal:', error);
            alert('Error logging meal. Please try again.');
        }
    };

    window.showMealLogSuccess = function(mealData) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Meal Logged Successfully!</h4>
                    <p class="text-sm opacity-90">${mealData.name} (${mealData.calories} cal)</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };

    window.updateDashboardStats = function() {
        // Get logged meals for today
        const today = new Date().toISOString().split('T')[0];
        const loggedMeals = JSON.parse(localStorage.getItem('loggedMeals') || '[]');
        const todayMeals = loggedMeals.filter(meal => meal.date === today);
        
        // Calculate totals
        const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        const totalFat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0);
        
        // Update dashboard display
        displayLoggedMeals(todayMeals);
        updateCalorieProgress(totalCalories);
        
        console.log('Today\'s totals:', { totalCalories, totalProtein, totalCarbs, totalFat });
    };

    window.displayLoggedMeals = function(meals) {
        const container = document.getElementById('logged-meals-container');
        
        if (meals.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 italic">No meals logged yet today</p>';
            return;
        }
        
        container.innerHTML = meals.map(meal => `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">${meal.type}</span>
                    <div>
                        <p class="text-sm font-medium">${meal.name}</p>
                        <p class="text-xs text-gray-500">${meal.time}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium">${meal.calories} cal</p>
                    <p class="text-xs text-gray-500">P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g</p>
                </div>
            </div>
        `).join('');
    };

    window.updateCalorieProgress = function(totalCalories) {
        // Update the calorie progress circle in the dashboard
        const targetCalories = 2100; // This could be dynamic based on user goals
        const percentage = Math.min((totalCalories / targetCalories) * 100, 100);
        
        // Find and update the calorie progress display
        const calorieElements = document.querySelectorAll('.font-semibold.text-lg');
        calorieElements.forEach(element => {
            if (element.textContent.includes('/ 2,100')) {
                element.textContent = `${totalCalories.toLocaleString()} / 2,100`;
            }
        });
        
        // Update progress circle if it exists
        const progressCircles = document.querySelectorAll('.progress-circle');
        progressCircles.forEach(circle => {
            const circumference = 2 * Math.PI * 25; // r=25
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });
        
        // Update percentage text
        const percentageElements = document.querySelectorAll('.absolute.text-sm.font-semibold');
        percentageElements.forEach(element => {
            if (element.textContent.includes('%')) {
                element.textContent = `${Math.round(percentage)}%`;
            }
        });
    };

    // Close meal log modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('meal-log-modal');
        if (e.target === modal) {
            hideMealLogModal();
        }
    });

    // Handle meal type selection styling
    document.addEventListener('change', function(e) {
        if (e.target.name === 'meal-type') {
            // Remove active styling from all labels
            document.querySelectorAll('.meal-type-option').forEach(label => {
                label.classList.remove('border-blue-600', 'bg-blue-50');
            });
            
            // Add active styling to selected label
            const selectedLabel = e.target.closest('.meal-type-option');
            if (selectedLabel) {
                selectedLabel.classList.add('border-blue-600', 'bg-blue-50');
            }
        }
    });

    // Workout Tracking Functions
    let workoutTimer = null;
    let workoutStartTime = null;
    let workoutPausedTime = 0;
    let isWorkoutPaused = false;
    let workoutData = {
        exercises: {},
        totalTime: 0,
        startTime: null,
        endTime: null
    };

    window.startWorkout = function() {
        openWorkoutTrackingModal();
    };

    window.openWorkoutTrackingModal = function() {
        const modal = document.getElementById('workout-tracking-modal');
        modal.classList.remove('hidden');
        
        // Initialize workout
        initializeWorkout();
        
        // Start timer
        startWorkoutTimer();
        
        // Ensure scrollbar is visible and styled
        setTimeout(() => {
            const workoutModal = modal.querySelector('.workout-modal');
            if (workoutModal) {
                // Set basic scrollbar properties
                workoutModal.style.overflowY = 'auto';
                workoutModal.style.overflowX = 'hidden';
                workoutModal.style.maxHeight = '75vh';
                workoutModal.style.minHeight = '600px';
                
                // Add visual indicator that content is scrollable
                const scrollIndicator = modal.querySelector('.scroll-indicator');
                if (scrollIndicator) {
                    scrollIndicator.style.animation = 'bounce 1s ease-in-out 3';
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.transform = 'translateY(0)';
                }
                
                // Add scroll event listener to hide indicator when scrolling
                workoutModal.addEventListener('scroll', function() {
                    workoutModal.classList.add('scrolling');
                    setTimeout(() => {
                        workoutModal.classList.remove('scrolling');
                    }, 1000);
                });
                
                console.log('Workout modal opened with natural scrollbar');
            }
        }, 100);
    };

    window.hideWorkoutTrackingModal = function() {
        const modal = document.getElementById('workout-tracking-modal');
        modal.classList.add('hidden');
        
        // Pause timer if workout is active
        if (workoutTimer && !isWorkoutPaused) {
            pauseWorkout();
        }
    };

    window.initializeWorkout = function() {
        workoutData = {
            exercises: {
                'bench-press': { completed: 0, sets: [] },
                'incline-press': { completed: 0, sets: [] },
                'shoulder-press': { completed: 0, sets: [] },
                'tricep-pushdowns': { completed: 0, sets: [] },
                'cardio': { completed: false, duration: 0, intensity: 'moderate' }
            },
            totalTime: 0,
            startTime: new Date(),
            endTime: null
        };
        
        // Reset all exercise counters
        document.querySelectorAll('[id$="-completed"]').forEach(element => {
            if (element.id === 'cardio-completed') {
                element.textContent = '0 min';
            } else {
                element.textContent = '0 completed';
            }
        });
        
        // Reset progress bar
        document.getElementById('workout-progress-bar').style.width = '0%';
    };

    window.startWorkoutTimer = function() {
        workoutStartTime = new Date();
        workoutTimer = setInterval(updateWorkoutTimer, 1000);
    };

    window.updateWorkoutTimer = function() {
        if (!isWorkoutPaused) {
            const now = new Date();
            const elapsed = Math.floor((now - workoutStartTime) / 1000) - workoutPausedTime;
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            const timerElement = document.getElementById('workout-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Add visual feedback for timer
                if (elapsed % 60 === 0) { // Every minute
                    timerElement.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        timerElement.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        }
    };

    window.pauseWorkout = function() {
        if (!isWorkoutPaused) {
            isWorkoutPaused = true;
            workoutPausedTime += Math.floor((new Date() - workoutStartTime) / 1000);
            
            document.getElementById('pause-btn').classList.add('hidden');
            document.getElementById('resume-btn').classList.remove('hidden');
        }
    };

    window.resumeWorkout = function() {
        if (isWorkoutPaused) {
            isWorkoutPaused = false;
            workoutStartTime = new Date();
            
            document.getElementById('pause-btn').classList.remove('hidden');
            document.getElementById('resume-btn').classList.add('hidden');
        }
    };

    window.completeSet = function(exercise, setNumber) {
        const exerciseCard = document.querySelector(`[data-exercise="${exercise}"]`);
        const repsInput = exerciseCard.querySelector(`.set-input:nth-child(${setNumber + 1}) input[placeholder="Reps"]`);
        const weightInput = exerciseCard.querySelector(`.set-input:nth-child(${setNumber + 1}) input[placeholder="Weight"]`);
        
        if (!repsInput.value || !weightInput.value) {
            alert('Please enter both reps and weight before completing the set.');
            return;
        }
        
        // Store set data
        if (!workoutData.exercises[exercise].sets) {
            workoutData.exercises[exercise].sets = [];
        }
        
        workoutData.exercises[exercise].sets.push({
            set: setNumber,
            reps: parseInt(repsInput.value),
            weight: parseFloat(weightInput.value),
            timestamp: new Date().toISOString()
        });
        
        // Update completed count
        workoutData.exercises[exercise].completed++;
        
        // Update display
        const completedElement = document.getElementById(`${exercise}-completed`);
        if (completedElement) {
            completedElement.textContent = `${workoutData.exercises[exercise].completed} completed`;
        }
        
        // Disable the set inputs
        repsInput.disabled = true;
        weightInput.disabled = true;
        
        // Find and update the complete button
        const completeButton = exerciseCard.querySelector(`.set-input:nth-child(${setNumber + 1}) button`);
        if (completeButton) {
            completeButton.disabled = true;
            completeButton.classList.add('completed');
            completeButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        }
        
        // Update progress bar
        updateWorkoutProgress();
        
        // Show success feedback
        showSetCompletionFeedback(exercise, setNumber);
    };

    window.completeCardio = function() {
        const duration = document.getElementById('cardio-duration').value;
        const intensity = document.getElementById('cardio-intensity').value;
        
        if (!duration) {
            alert('Please enter cardio duration.');
            return;
        }
        
        // Store cardio data
        workoutData.exercises.cardio = {
            completed: true,
            duration: parseInt(duration),
            intensity: intensity,
            timestamp: new Date().toISOString()
        };
        
        // Update display
        document.getElementById('cardio-completed').textContent = `${duration} min`;
        
        // Disable cardio inputs
        document.getElementById('cardio-duration').disabled = true;
        document.getElementById('cardio-intensity').disabled = true;
        
        // Find and update the complete cardio button
        const completeButton = document.querySelector('button[onclick="completeCardio()"]');
        if (completeButton) {
            completeButton.disabled = true;
            completeButton.classList.add('completed');
            completeButton.innerHTML = '<i class="bi bi-check-circle-fill mr-2"></i>Cardio Complete!';
        }
        
        // Update progress bar
        updateWorkoutProgress();
        
        // Show success feedback
        showCardioCompletionFeedback();
    };

    window.updateWorkoutProgress = function() {
        const totalExercises = Object.keys(workoutData.exercises).length;
        let completedExercises = 0;
        
        Object.values(workoutData.exercises).forEach(exercise => {
            if (exercise.completed && exercise.completed > 0) {
                completedExercises++;
            }
        });
        
        const progress = (completedExercises / totalExercises) * 100;
        document.getElementById('workout-progress-bar').style.width = `${progress}%`;
        
        // Update progress percentage text
        const progressPercentage = document.getElementById('progress-percentage');
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(progress)}% Complete`;
        }
        
        // Update exercise card styling when completed
        Object.keys(workoutData.exercises).forEach(exerciseName => {
            const exerciseCard = document.querySelector(`[data-exercise="${exerciseName}"]`);
            if (exerciseCard) {
                const exercise = workoutData.exercises[exerciseName];
                if (exercise.completed && exercise.completed > 0) {
                    exerciseCard.classList.add('completed');
                } else {
                    exerciseCard.classList.remove('completed');
                }
            }
        });
    };

    window.showSetCompletionFeedback = function(exercise, setNumber) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Set ${setNumber} Complete!</h4>
                    <p class="text-sm opacity-90">Great work on ${exercise.replace('-', ' ')}!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    };

    window.showCardioCompletionFeedback = function() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Cardio Complete!</h4>
                    <p class="text-sm opacity-90">Excellent cardio session!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    };

    window.finishWorkout = function() {
        // Stop timer
        if (workoutTimer) {
            clearInterval(workoutTimer);
            workoutTimer = null;
        }
        
        // Calculate total workout time
        const endTime = new Date();
        workoutData.endTime = endTime;
        workoutData.totalTime = Math.floor((endTime - workoutData.startTime) / 1000) - workoutPausedTime;
        
        // Store workout data
        const existingWorkouts = JSON.parse(localStorage.getItem('loggedWorkouts') || '[]');
        existingWorkouts.push(workoutData);
        localStorage.setItem('loggedWorkouts', JSON.stringify(existingWorkouts));
        
        // Show completion notification
        showWorkoutCompletionNotification();
        
        // Close modal
        hideWorkoutTrackingModal();
        
        // Update dashboard stats
        updateWorkoutStats();
    };

    window.showWorkoutCompletionNotification = function() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-trophy text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Workout Complete!</h4>
                    <p class="text-sm opacity-90">Great job! You've completed your Push Day workout.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    };

    window.updateWorkoutStats = function() {
        // Update workout count in dashboard
        const workoutCountElement = document.querySelector('.font-semibold.text-lg:contains("18 this month")');
        if (workoutCountElement) {
            const currentCount = parseInt(workoutCountElement.textContent.match(/\d+/)[0]);
            workoutCountElement.textContent = `${currentCount + 1} this month`;
        }
    };

    // Close workout tracking modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('workout-tracking-modal');
        if (e.target === modal) {
            hideWorkoutTrackingModal();
        }
        
        // Close 6-day split modal when clicking outside
        const sixDayModal = document.getElementById('six-day-split-modal');
        if (e.target === sixDayModal) {
            hideSixDaySplitModal();
        }
        
        // Close workout day detail modal when clicking outside
        const workoutDayModal = document.getElementById('workout-day-detail-modal');
        if (e.target === workoutDayModal) {
            closeWorkoutDayDetailModal();
        }
    });

    // Enhanced scrolling functionality for workout modal
    window.scrollToExercise = function(exerciseName) {
        const exerciseCard = document.querySelector(`[data-exercise="${exerciseName}"]`);
        if (exerciseCard) {
            exerciseCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
            
            // Add highlight effect
            exerciseCard.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            setTimeout(() => {
                exerciseCard.style.boxShadow = '';
            }, 2000);
        }
    };
    
    // Test scrollbar functionality
    window.testScroll = function() {
        const workoutModal = document.querySelector('.workout-modal');
        if (workoutModal) {
            console.log('Testing scrollbar...');
            console.log('Scroll height:', workoutModal.scrollHeight);
            console.log('Client height:', workoutModal.clientHeight);
            console.log('Scroll top:', workoutModal.scrollTop);
            
            // Test scrolling down
            workoutModal.scrollTop = 200;
            console.log('Scrolled down to:', workoutModal.scrollTop);
            
            // Test scrolling back up
            setTimeout(() => {
                workoutModal.scrollTop = 0;
                console.log('Scrolled back to top:', workoutModal.scrollTop);
            }, 1000);
        }
    };

    // Today's Plan Modal Functions
    window.openTodayPlanModal = function() {
        const modal = document.getElementById('today-plan-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Populate modal with today's plan data
            populateTodayPlanModal();
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                }
            }, 100);
        }
    };

    window.hideTodayPlanModal = function() {
        const modal = document.getElementById('today-plan-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    function populateTodayPlanModal() {
        // Get today's date and determine workout day
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Define workout plan for the week
        const workoutPlan = {
            1: { title: 'Push Day', day: 'Day 1 of 6 - Monday', exercises: ['Bench Press', 'Incline Dumbbell Press', 'Shoulder Press', 'Tricep Pushdowns', 'Cardio'] },
            2: { title: 'Pull Day', day: 'Day 2 of 6 - Tuesday', exercises: ['Deadlifts', 'Barbell Rows', 'Pull-ups', 'Bicep Curls', 'Cardio'] },
            3: { title: 'Legs Day', day: 'Day 3 of 6 - Wednesday', exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press', 'Calf Raises', 'Cardio'] },
            4: { title: 'Upper Push', day: 'Day 4 of 6 - Thursday', exercises: ['Military Press', 'Dips', 'Lateral Raises', 'Close-Grip Bench', 'Cardio'] },
            5: { title: 'Upper Pull', day: 'Day 5 of 6 - Friday', exercises: ['T-Bar Rows', 'Face Pulls', 'Hammer Curls', 'Preacher Curls', 'Cardio'] },
            6: { title: 'Lower + Cardio', day: 'Day 6 of 6 - Saturday', exercises: ['Front Squats', 'Lunges', 'Leg Extensions', 'Cardio Session', 'Stretching'] }
        };
        
        // Get today's plan (default to Monday if it's Sunday)
        const todayPlan = workoutPlan[dayOfWeek === 0 ? 1 : dayOfWeek] || workoutPlan[1];
        
        // Update modal content
        document.getElementById('modal-plan-title').textContent = todayPlan.title;
        document.getElementById('modal-plan-day').textContent = todayPlan.day;
        
        // Update dashboard display
        document.getElementById('today-plan-title').textContent = todayPlan.title;
        document.getElementById('today-plan-day').textContent = todayPlan.day.replace('Day ', '').split(' - ')[0];
        
        // Populate exercise list
        const exerciseList = document.getElementById('modal-exercise-list');
        exerciseList.innerHTML = todayPlan.exercises.map((exercise, index) => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">${index + 1}</span>
                    <div>
                        <h4 class="font-medium text-gray-900">${exercise}</h4>
                        <p class="text-sm text-gray-600">${getExerciseDetails(exercise)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-sm text-gray-500">${getExerciseTime(exercise)}</span>
                </div>
            </div>
        `).join('');
    }

    function getExerciseDetails(exercise) {
        const details = {
            'Bench Press': '4 sets x 8-10 reps',
            'Incline Dumbbell Press': '3 sets x 10-12 reps',
            'Shoulder Press': '3 sets x 10 reps',
            'Tricep Pushdowns': '3 sets x 12-15 reps',
            'Cardio': '20-30 minutes moderate intensity',
            'Deadlifts': '4 sets x 6-8 reps',
            'Barbell Rows': '3 sets x 10-12 reps',
            'Pull-ups': '3 sets x 8-12 reps',
            'Bicep Curls': '3 sets x 12-15 reps',
            'Squats': '4 sets x 8-10 reps',
            'Romanian Deadlifts': '3 sets x 10-12 reps',
            'Leg Press': '3 sets x 12-15 reps',
            'Calf Raises': '4 sets x 15-20 reps',
            'Military Press': '4 sets x 8-10 reps',
            'Dips': '3 sets x 10-15 reps',
            'Lateral Raises': '3 sets x 12-15 reps',
            'Close-Grip Bench': '3 sets x 8-10 reps',
            'T-Bar Rows': '3 sets x 10-12 reps',
            'Face Pulls': '3 sets x 15-20 reps',
            'Hammer Curls': '3 sets x 12-15 reps',
            'Preacher Curls': '3 sets x 10-12 reps',
            'Front Squats': '3 sets x 8-10 reps',
            'Lunges': '3 sets x 10-12 reps each leg',
            'Leg Extensions': '3 sets x 15-20 reps',
            'Stretching': '10-15 minutes flexibility work'
        };
        return details[exercise] || '3 sets x 10-12 reps';
    }

    function getExerciseTime(exercise) {
        const times = {
            'Cardio': '20-30 min',
            'Stretching': '10-15 min',
            'Bench Press': '15-20 min',
            'Deadlifts': '20-25 min',
            'Squats': '20-25 min'
        };
        return times[exercise] || '10-15 min';
    }

    // Calories Modal Functions
    window.openCaloriesModal = function() {
        const modal = document.getElementById('calories-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Populate modal with current calorie data
            populateCaloriesModal();
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                }
            }, 100);
        }
    };

    window.hideCaloriesModal = function() {
        const modal = document.getElementById('calories-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    function populateCaloriesModal() {
        // Get today's logged meals
        const todayMeals = getTodayMeals();
        const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        const totalFat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0);
        
        const targetCalories = 2100;
        const remainingCalories = targetCalories - totalCalories;
        
        // Update modal displays
        document.getElementById('modal-target-calories').textContent = targetCalories.toLocaleString();
        document.getElementById('modal-consumed-calories').textContent = totalCalories.toLocaleString();
        document.getElementById('modal-remaining-calories').textContent = remainingCalories.toLocaleString();
        
        document.getElementById('modal-protein-grams').textContent = `${totalProtein}g`;
        document.getElementById('modal-carbs-grams').textContent = `${totalCarbs}g`;
        document.getElementById('modal-fat-grams').textContent = `${totalFat}g`;
        
        // Update progress bars
        document.getElementById('modal-protein-bar').style.width = `${Math.min((totalProtein / 100) * 100, 100)}%`;
        document.getElementById('modal-carbs-bar').style.width = `${Math.min((totalCarbs / 250) * 100, 100)}%`;
        document.getElementById('modal-fat-bar').style.width = `${Math.min((totalFat / 70) * 100, 100)}%`;
        
        // Populate meals list
        const mealsList = document.getElementById('modal-meals-list');
        if (todayMeals.length === 0) {
            mealsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="bi bi-emoji-frown text-4xl mb-3"></i>
                    <p>No meals logged today</p>
                    <p class="text-sm">Start by logging your first meal!</p>
                    </div>
            `;
        } else {
            mealsList.innerHTML = todayMeals.map(meal => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="bg-green-100 text-green-800 p-2 rounded-full">
                            <i class="bi bi-egg-fried text-lg"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${meal.name}</h4>
                            <p class="text-sm text-gray-600">${meal.mealType} • ${meal.time}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-gray-900">${meal.calories} cal</p>
                        <p class="text-sm text-gray-600">P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Protein Modal Functions
    window.openProteinModal = function() {
        const modal = document.getElementById('protein-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Populate modal with current protein data
            populateProteinModal();
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                }
            }, 100);
        }
    };

    window.hideProteinModal = function() {
        const modal = document.getElementById('protein-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    function populateProteinModal() {
        // Get today's logged meals
        const todayMeals = getTodayMeals();
        const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const targetProtein = 100;
        const remainingProtein = targetProtein - totalProtein;
        
        // Update modal displays
        document.getElementById('modal-protein-target').textContent = `${targetProtein}g`;
        document.getElementById('modal-protein-consumed').textContent = `${totalProtein}g`;
        document.getElementById('modal-protein-remaining').textContent = `${remainingProtein}g`;
        
        // Populate protein sources
        const proteinSources = document.getElementById('modal-protein-sources');
        if (todayMeals.length === 0) {
            proteinSources.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="bi bi-emoji-frown text-4xl mb-3"></i>
                    <p>No meals logged today</p>
                    <p class="text-sm">Log your meals to track protein intake!</p>
                </div>
            `;
        } else {
            proteinSources.innerHTML = todayMeals
                .filter(meal => meal.protein > 0)
                .map(meal => `
                    <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-100 text-blue-800 p-2 rounded-full">
                                <i class="bi bi-lightning text-lg"></i>
                            </div>
                            <div>
                                <h4 class="font-medium text-blue-900">${meal.name}</h4>
                                <p class="text-sm text-blue-600">${meal.mealType} • ${meal.time}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-blue-900">${meal.protein}g protein</p>
                            <p class="text-sm text-blue-600">${meal.calories} calories</p>
                        </div>
                    </div>
                `).join('');
        }
    }

    // Workouts Modal Functions
    window.openWorkoutsModal = function() {
        const modal = document.getElementById('workouts-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Populate modal with current workout data
            populateWorkoutsModal();
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                }
            }, 100);
        }
    };

    window.hideWorkoutsModal = function() {
        const modal = document.getElementById('workouts-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    function populateWorkoutsModal() {
        // Get logged workouts
        const loggedWorkouts = JSON.parse(localStorage.getItem('loggedWorkouts') || '[]');
        const thisMonth = new Date().getMonth();
        const thisWeek = getWeekNumber(new Date());
        
        // Filter workouts by month and week
        const monthlyWorkouts = loggedWorkouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.getMonth() === thisMonth;
        });
        
        const weeklyWorkouts = loggedWorkouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return getWeekNumber(workoutDate) === thisWeek;
        });
        
        // Calculate total workout time
        const totalTime = loggedWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
        const totalHours = Math.floor(totalTime / 3600);
        const totalMinutes = Math.floor((totalTime % 3600) / 60);
        
        // Calculate workout streak (simplified)
        const workoutStreak = calculateWorkoutStreak(loggedWorkouts);
        
        // Update modal displays
        document.getElementById('modal-monthly-workouts').textContent = monthlyWorkouts.length;
        document.getElementById('modal-weekly-workouts').textContent = weeklyWorkouts.length;
        document.getElementById('modal-total-time').textContent = totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`;
        document.getElementById('modal-workout-streak').textContent = `${workoutStreak} days`;
        
        // Update dashboard display
        document.getElementById('workouts-count').textContent = `${monthlyWorkouts.length} this month`;
        
        // Populate recent workouts
        const recentWorkouts = document.getElementById('modal-recent-workouts');
        if (loggedWorkouts.length === 0) {
            recentWorkouts.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="bi bi-emoji-frown text-4xl mb-3"></i>
                    <p>No workouts logged yet</p>
                    <p class="text-sm">Complete your first workout to see it here!</p>
                </div>
            `;
        } else {
            recentWorkouts.innerHTML = loggedWorkouts
                .slice(0, 5)
                .map(workout => `
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="bg-purple-100 text-purple-800 p-2 rounded-full">
                                <i class="bi bi-lightning text-lg"></i>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900">${workout.workoutType || 'Workout'}</h4>
                                <p class="text-sm text-gray-600">${formatDate(workout.date)} • ${formatDuration(workout.duration)}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-gray-900">${workout.exercises?.length || 0} exercises</p>
                            <p class="text-sm text-gray-600">${workout.totalSets || 0} sets completed</p>
                        </div>
                    </div>
                `).join('');
        }
    }

    // Helper functions
    function getTodayMeals() {
        const today = new Date().toDateString();
        const loggedMeals = JSON.parse(localStorage.getItem('loggedMeals') || '[]');
        return loggedMeals.filter(meal => new Date(meal.date).toDateString() === today);
    }

    function getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    function calculateWorkoutStreak(workouts) {
        if (workouts.length === 0) return 0;
        
        const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        let streak = 0;
        let currentDate = new Date();
        
        for (let i = 0; i < sortedWorkouts.length; i++) {
            const workoutDate = new Date(sortedWorkouts[i].date);
            const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 1) {
                streak++;
                currentDate = workoutDate;
            } else {
                break;
            }
        }
        
        return streak;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatDuration(seconds) {
        if (!seconds) return '0 min';
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    }
    
    // 6-Day Split Modal Functions
    window.openSixDaySplitModal = function() {
        const modal = document.getElementById('six-day-split-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    // Set basic scrollbar properties
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                    
                    console.log('6-Day Split modal opened with natural scrollbar');
                }
            }, 100);
        }
    };
    
    window.hideSixDaySplitModal = function() {
        const modal = document.getElementById('six-day-split-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };
    
    // Individual Workout Day Modal Function
    window.openWorkoutDayModal = function(dayTitle, focusAreas, exercises, colorTheme) {
        // Create modal HTML dynamically
        const modalHTML = `
            <div id="workout-day-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="workout-modal bg-white p-8 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-scroll relative">
                    <!-- Visual Scrollbar Indicator -->
                    <div class="scrollbar-indicator"></div>
                    
                    <div class="modal-header">
                        <div class="flex justify-between items-center">
                            <h2 class="modal-title text-2xl font-bold">${dayTitle}</h2>
                            <button onclick="closeWorkoutDayDetailModal()" class="text-gray-500 hover:text-gray-700 transition-colors">
                                <i class="bi bi-x-lg text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Workout Overview -->
                    <div class="mb-6 p-6 bg-gradient-to-r from-${colorTheme}-50 to-${colorTheme}-100 rounded-xl border border-${colorTheme}-200">
                        <h3 class="text-xl font-semibold text-${colorTheme}-800 mb-3">Focus Areas</h3>
                        <p class="text-${colorTheme}-700">${focusAreas}</p>
                    </div>
                    
                    <!-- Exercise List -->
                    <div class="space-y-4 mb-6">
                        <h3 class="text-lg font-semibold">Exercises</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${exercises.map((exercise, index) => `
                                <div class="exercise-card p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-3">
                                            <span class="bg-${colorTheme}-500 text-white text-xs px-2 py-1 rounded-full">${index + 1}</span>
                                            <span class="font-medium">${exercise}</span>
                                        </div>
                                        <i class="bi bi-check-circle text-${colorTheme}-500 text-xl"></i>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button onclick="startWorkout()" class="bg-${colorTheme}-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-${colorTheme}-700 transition-colors">
                            <i class="bi bi-play-fill mr-2"></i> Start This Workout
                        </button>
                        <button onclick="closeWorkoutDayDetailModal()" class="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors">
                            <i class="bi bi-x-circle mr-2"></i> Close
                        </button>
                    </div>
                    
                    <!-- Bottom Spacer to ensure scrolling -->
                    <div class="h-20"></div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('workout-day-detail-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('workout-day-detail-modal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Ensure scrollbar is visible and styled
        setTimeout(() => {
            const workoutModal = modal.querySelector('.workout-modal');
            if (workoutModal) {
                // Set basic scrollbar properties
                workoutModal.style.overflowY = 'auto';
                workoutModal.style.overflowX = 'hidden';
                workoutModal.style.maxHeight = '80vh';
                workoutModal.style.minHeight = '600px';
                
                console.log('Workout day detail modal opened for:', dayTitle);
            }
        }, 100);
    };
    
    // Close workout day detail modal
    window.closeWorkoutDayDetailModal = function() {
        const modal = document.getElementById('workout-day-detail-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    };

    // Auto-hide scroll indicator after first scroll
    let scrollIndicatorHidden = false;
    document.addEventListener('scroll', function(e) {
        if (e.target.classList.contains('workout-modal') && !scrollIndicatorHidden) {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    scrollIndicator.style.display = 'none';
                }, 300);
                scrollIndicatorHidden = true;
            }
        }
    }, { passive: true });
    
    // Weekly Challenges System
    let challengeData = {
        cardio: { completed: 3, target: 5, points: 0 },
        strength: { completed: 3, target: 4, points: 0 },
        consistency: { completed: 3, target: 6, points: 0 },
        totalPoints: 215
    };
    
    // Initialize challenges from localStorage
    function initializeChallenges() {
        const saved = localStorage.getItem('challengeData');
        if (saved) {
            challengeData = JSON.parse(saved);
        }
        updateChallengeDisplay();
    }
    
    // Update challenge display
    function updateChallengeDisplay() {
        // Update main dashboard challenge
        const progressBar = document.getElementById('challenge-progress-bar');
        const progressText = document.getElementById('challenge-progress-text');
        const timeLeft = document.getElementById('challenge-time-left');
        
        if (progressBar && progressText && timeLeft) {
            const percentage = (challengeData.cardio.completed / challengeData.cardio.target) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${challengeData.cardio.completed}/${challengeData.cardio.target} completed`;
            
            // Calculate days left in week
            const now = new Date();
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
            const daysLeft = Math.ceil((endOfWeek - now) / (1000 * 60 * 60 * 24));
            timeLeft.textContent = `${daysLeft} days left`;
        }
        
        // Update challenges modal if open
        updateChallengesModal();
    }
    
    // Update challenges modal display
    function updateChallengesModal() {
        // Update cardio challenge
        const cardioProgress = document.getElementById('cardio-challenge-progress');
        const cardioProgressText = document.getElementById('cardio-progress-text');
        if (cardioProgress && cardioProgressText) {
            const percentage = (challengeData.cardio.completed / challengeData.cardio.target) * 100;
            cardioProgress.style.width = `${percentage}%`;
            cardioProgressText.textContent = `${challengeData.cardio.completed}/${challengeData.cardio.target} completed`;
        }
        
        // Update strength challenge
        const strengthProgress = document.getElementById('strength-challenge-progress');
        const strengthProgressText = document.getElementById('strength-progress-text');
        if (strengthProgress && strengthProgressText) {
            const percentage = (challengeData.strength.completed / challengeData.strength.target) * 100;
            strengthProgress.style.width = `${percentage}%`;
            strengthProgressText.textContent = `${challengeData.strength.completed}/${challengeData.strength.target} completed`;
        }
        
        // Update consistency challenge
        const consistencyProgress = document.getElementById('consistency-challenge-progress');
        const consistencyProgressText = document.getElementById('consistency-progress-text');
        if (consistencyProgress && consistencyProgressText) {
            const percentage = (challengeData.consistency.completed / challengeData.consistency.target) * 100;
            consistencyProgress.style.width = `${percentage}%`;
            consistencyProgressText.textContent = `${challengeData.consistency.completed}/${challengeData.consistency.target} completed`;
        }
        
        // Update total points
        const totalPoints = document.getElementById('total-points');
        if (totalPoints) {
            totalPoints.textContent = challengeData.totalPoints;
        }
    }
    
    // Complete cardio session
    window.completeCardioSession = function() {
        if (challengeData.cardio.completed < challengeData.cardio.target) {
            challengeData.cardio.completed++;
            challengeData.totalPoints += 20;
            
            // Check if challenge completed
            if (challengeData.cardio.completed >= challengeData.cardio.target) {
                challengeData.totalPoints += 100; // Bonus points
                showChallengeCompleteNotification('Cardio King', 'Endurance Master badge unlocked!', 100);
            }
            
            // Save to localStorage
            localStorage.setItem('challengeData', JSON.stringify(challengeData));
            
            // Update display
            updateChallengeDisplay();
            
            // Show completion feedback
            showCardioSessionComplete();
        } else {
            alert('Cardio King challenge already completed!');
        }
    };
    
    // Complete strength session
    window.completeStrengthSession = function() {
        if (challengeData.strength.completed < challengeData.strength.target) {
            challengeData.strength.completed++;
            challengeData.totalPoints += 25;
            
            // Check if challenge completed
            if (challengeData.strength.completed >= challengeData.strength.target) {
                challengeData.totalPoints += 150; // Bonus points
                showChallengeCompleteNotification('Strength Warrior', 'Power Master badge unlocked!', 150);
            }
            
            // Save to localStorage
            challengeData.totalPoints += 25;
            localStorage.setItem('challengeData', JSON.stringify(challengeData));
            
            // Update display
            updateChallengeDisplay();
            
            // Show completion feedback
            showStrengthSessionComplete();
        } else {
            alert('Strength Warrior challenge already completed!');
        }
    };
    
    // Complete workout day
    window.completeWorkoutDay = function() {
        if (challengeData.consistency.completed < challengeData.consistency.target) {
            challengeData.consistency.completed++;
            challengeData.totalPoints += 30;
            
            // Check if challenge completed
            if (challengeData.consistency.completed >= challengeData.consistency.target) {
                challengeData.totalPoints += 200; // Bonus points
                showChallengeCompleteNotification('Consistency King', 'Consistency Master badge unlocked!', 200);
            }
            
            // Save to localStorage
            localStorage.setItem('challengeData', JSON.stringify(challengeData));
            
            // Update display
            updateChallengeDisplay();
            
            // Show completion feedback
            showWorkoutDayComplete();
        } else {
            alert('Consistency King challenge already completed!');
        }
    };
    
    // Show challenge completion notification
    function showChallengeCompleteNotification(challengeName, message, points) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg z-50 transform transition-all duration-500';
        notification.innerHTML = `
            <div class="text-center">
                <div class="bg-white bg-opacity-20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <i class="bi bi-trophy text-2xl"></i>
                </div>
                <h4 class="font-bold text-lg mb-2">${challengeName} Challenge Complete!</h4>
                <p class="text-sm opacity-90 mb-3">${message}</p>
                <div class="bg-white bg-opacity-20 rounded-lg p-2">
                    <span class="text-2xl font-bold">+${points} points earned!</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add celebration animation
        notification.classList.add('challenge-complete');
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // Show cardio session complete feedback
    function showCardioSessionComplete() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-heart-pulse text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Cardio Session Complete!</h4>
                    <p class="text-sm opacity-90">+20 points earned</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Show strength session complete feedback
    function showStrengthSessionComplete() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-lightning text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Strength Session Complete!</h4>
                    <p class="text-sm opacity-90">+25 points earned</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Show workout day complete feedback
    function showWorkoutDayComplete() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-calendar-check text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Workout Day Complete!</h4>
                    <p class="text-sm opacity-90">+30 points earned</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Open challenges modal
    window.openChallengesModal = function() {
        const modal = document.getElementById('challenges-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    // Set basic scrollbar properties
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                    
                    console.log('Challenges modal opened with natural scrollbar');
                }
            }, 100);
        }
    };
    
    // Hide challenges modal
    window.hideChallengesModal = function() {
        const modal = document.getElementById('challenges-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };
    
    // Initialize challenges when page loads
    initializeChallenges();
    
    // Achievements System
    let achievementsData = {
        unlocked: [
            {
                name: 'First Workout',
                description: 'Complete your first workout to earn this badge.',
                unlockedDate: '2025-01-01',
                points: 50,
                category: 'Beginner',
                icon: 'bi-trophy-fill',
                color: 'amber'
            },
            {
                name: 'Week Streak',
                description: 'Maintain a 7-day workout streak.',
                unlockedDate: '2025-01-05',
                points: 100,
                category: 'Intermediate',
                icon: 'bi-calendar-check-fill',
                color: 'green'
            },
            {
                name: 'Protein Pro',
                description: 'Meet your daily protein target for 5 consecutive days.',
                unlockedDate: '2025-01-03',
                points: 75,
                category: 'Intermediate',
                icon: 'bi-lightning-fill',
                color: 'blue'
            }
        ],
        locked: [
            {
                name: 'Endurance Master',
                description: 'Complete the Cardio King challenge.',
                requirement: 'Finish 5 cardio sessions in one week',
                progress: 3,
                target: 5,
                points: 100,
                category: 'Advanced',
                icon: 'bi-heart-pulse',
                color: 'indigo'
            },
            {
                name: 'Power Master',
                description: 'Complete the Strength Warrior challenge.',
                requirement: 'Finish 4 strength training sessions in one week',
                progress: 3,
                target: 4,
                points: 150,
                category: 'Advanced',
                icon: 'bi-lightning-charge',
                color: 'red'
            },
            {
                name: 'Consistency Master',
                description: 'Complete the Consistency King challenge.',
                requirement: 'Work out for 6 consecutive days',
                progress: 3,
                target: 6,
                points: 200,
                category: 'Advanced',
                icon: 'bi-calendar-week',
                color: 'purple'
            }
        ]
    };
    
    // Initialize achievements from localStorage
    function initializeAchievements() {
        const saved = localStorage.getItem('achievementsData');
        if (saved) {
            achievementsData = JSON.parse(saved);
        }
        updateAchievementsDisplay();
    }
    
    // Update achievements display
    function updateAchievementsDisplay() {
        // Update total badges count
        const totalBadges = document.getElementById('total-badges');
        if (totalBadges) {
            totalBadges.textContent = `${achievementsData.unlocked.length}/${achievementsData.unlocked.length + achievementsData.locked.length}`;
        }
        
        // Update challenge progress for locked achievements
        achievementsData.locked.forEach(achievement => {
            if (achievement.name === 'Endurance Master') {
                achievement.progress = challengeData.cardio.completed;
            } else if (achievement.name === 'Power Master') {
                achievement.progress = challengeData.strength.completed;
            } else if (achievement.name === 'Consistency Master') {
                achievement.progress = challengeData.consistency.completed;
            }
        });
        
        // Save updated data
        localStorage.setItem('achievementsData', JSON.stringify(achievementsData));
    }
    
    // Show achievement details
    window.showAchievementDetails = function(achievementName, colorTheme, message, description, isUnlocked, unlockDate) {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 bg-gradient-to-r from-${colorTheme}-500 to-${colorTheme}-600 text-white p-6 rounded-lg shadow-lg z-50 transform transition-all duration-500 achievement-notification`;
        
        const iconClass = isUnlocked ? 'bi-trophy-fill' : 'bi-lock-fill';
        const statusText = isUnlocked ? 'Unlocked!' : 'Locked';
        const dateText = isUnlocked ? `Unlocked: ${unlockDate}` : 'Not yet unlocked';
        
        notification.innerHTML = `
            <div class="text-center">
                <div class="bg-white bg-opacity-20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <i class="bi ${iconClass} text-2xl"></i>
                </div>
                <h4 class="font-bold text-lg mb-2">${achievementName}</h4>
                <p class="text-sm opacity-90 mb-3">${message}</p>
                <p class="text-xs opacity-75 mb-3">${description}</p>
                <div class="bg-white bg-opacity-20 rounded-lg p-2">
                    <span class="text-sm font-medium">${statusText}</span>
                    <p class="text-xs opacity-75">${dateText}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4000);
    };
    
    // Open achievements modal
    window.openAchievementsModal = function() {
        const modal = document.getElementById('achievements-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Ensure scrollbar is visible and styled
            setTimeout(() => {
                const workoutModal = modal.querySelector('.workout-modal');
                if (workoutModal) {
                    // Set basic scrollbar properties
                    workoutModal.style.overflowY = 'auto';
                    workoutModal.style.overflowX = 'hidden';
                    workoutModal.style.maxHeight = '85vh';
                    workoutModal.style.minHeight = '600px';
                    
                    console.log('Achievements modal opened with natural scrollbar');
                }
            }, 100);
        }
    };
    
    // Hide achievements modal
    window.hideAchievementsModal = function() {
        const modal = document.getElementById('achievements-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };
    
    // Check for new achievements
    function checkForNewAchievements() {
        // Check if any locked achievements should be unlocked
        achievementsData.locked.forEach((achievement, index) => {
            if (achievement.progress >= achievement.target) {
                // Move achievement from locked to unlocked
                const unlockedAchievement = {
                    name: achievement.name,
                    description: achievement.description,
                    unlockedDate: new Date().toISOString().split('T')[0],
                    points: achievement.points,
                    category: achievement.category,
                    icon: achievement.icon,
                    color: achievement.color
                };
                
                achievementsData.unlocked.push(unlockedAchievement);
                achievementsData.locked.splice(index, 1);
                
                // Show achievement unlock notification
                showAchievementUnlockNotification(unlockedAchievement);
                
                // Update display
                updateAchievementsDisplay();
            }
        });
    }
    
    // Show achievement unlock notification
    function showAchievementUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg z-50 transform transition-all duration-500 achievement-notification';
        
        notification.innerHTML = `
            <div class="text-center">
                <div class="bg-white bg-opacity-20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                    <i class="bi ${achievement.icon} text-2xl"></i>
                </div>
                <h4 class="font-bold text-lg mb-2">🎉 New Achievement Unlocked!</h4>
                <p class="text-sm opacity-90 mb-3">${achievement.name}</p>
                <div class="bg-white bg-opacity-20 rounded-lg p-2">
                    <span class="text-sm font-medium">+${achievement.points} points earned!</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add celebration animation
        notification.classList.add('badge-unlock');
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // Initialize achievements when page loads
    initializeAchievements();
    
    // Check for new achievements when challenges are updated
    const originalUpdateChallengeDisplay = updateChallengeDisplay;
    updateChallengeDisplay = function() {
        originalUpdateChallengeDisplay();
        checkForNewAchievements();
    };
    
    // Additional Button Functionality
    
    // Mark exercise as complete in dashboard
    window.markExerciseComplete = function(exerciseName) {
        const exerciseCard = document.querySelector(`button[onclick="markExerciseComplete('${exerciseName}')"]`);
        if (exerciseCard) {
            // Toggle completion state
            const isCompleted = exerciseCard.classList.contains('completed');
            
            if (isCompleted) {
                exerciseCard.classList.remove('completed', 'text-green-600');
                exerciseCard.classList.add('text-blue-600');
                exerciseCard.innerHTML = '<i class="bi bi-check-circle text-xl"></i>';
            } else {
                exerciseCard.classList.add('completed', 'text-green-600');
                exerciseCard.classList.remove('text-blue-600');
                exerciseCard.innerHTML = '<i class="bi bi-check-circle-fill text-xl"></i>';
            }
            
            // Show feedback
            showExerciseCompletionFeedback(exerciseName, !isCompleted);
        }
    };
    
    // Show exercise completion feedback
    function showExerciseCompletionFeedback(exerciseName, isCompleted) {
        const status = isCompleted ? 'completed' : 'unmarked';
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">${exerciseName.replace('-', ' ')} ${status}!</h4>
                    <p class="text-sm opacity-90">${isCompleted ? 'Great work!' : 'Marked as incomplete'}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Open meal plan modal
    window.openMealPlanModal = function() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-calendar-week text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Meal Plan</h4>
                    <p class="text-sm opacity-90">Full meal plan feature coming soon!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // Select meal frequency in onboarding
    window.selectMealFrequency = function(frequency) {
        // Remove active state from all buttons
        document.querySelectorAll('button[onclick^="selectMealFrequency"]').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
            btn.classList.add('border-gray-300', 'text-gray-700');
        });
        
        // Add active state to selected button
        const selectedButton = document.querySelector(`button[onclick="selectMealFrequency('${frequency}')"]`);
        if (selectedButton) {
            selectedButton.classList.remove('border-gray-300', 'text-gray-700');
            selectedButton.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        }
        
        // Store selection
        localStorage.setItem('mealFrequency', frequency);
        
        // Show feedback
        showMealFrequencyFeedback(frequency);
    };
    
    // Show meal frequency selection feedback
    function showMealFrequencyFeedback(frequency) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Meal Frequency Selected</h4>
                    <p class="text-sm opacity-90">${frequency} meals per day</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Subscribe to newsletter
    window.subscribeNewsletter = function() {
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();
        
        if (!email) {
            showNewsletterError('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNewsletterError('Please enter a valid email address');
            return;
        }
        
        // Simulate subscription
        emailInput.disabled = true;
        const subscribeButton = document.querySelector('button[onclick="subscribeNewsletter()"]');
        const originalText = subscribeButton.textContent;
        subscribeButton.textContent = 'Subscribing...';
        subscribeButton.disabled = true;
        
        setTimeout(() => {
            // Show success
            showNewsletterSuccess(email);
            
            // Reset form
            emailInput.value = '';
            emailInput.disabled = false;
            subscribeButton.textContent = originalText;
            subscribeButton.disabled = false;
        }, 1500);
    };
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show newsletter success
    function showNewsletterSuccess(email) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-check-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Newsletter Subscription Successful!</h4>
                    <p class="text-sm opacity-90">${email} has been subscribed</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    // Show newsletter error
    function showNewsletterError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-exclamation-circle text-xl mr-2"></i>
                <div>
                    <h4 class="font-medium">Subscription Error</h4>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});