document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signOutForm');
    const studentSelect = document.getElementById('studentSelect');
    const parentSelect = document.getElementById('parentSelect');
    const logList = document.getElementById('logList');

    // Function to fetch data from CSV file
    function fetchDataFromCSV(url) {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                // Parse CSV data
                const rows = data.split('\n').slice(1); // Skip header row
                const students = rows.map(row => {
                    const [name, parent] = row.split(',');
                    return { name, parent };
                });
                return students;
            });
    }

    // Function to populate dropdowns with student names and parent names
    function populateDropdowns(students) {
        students.forEach(student => {
            const option = document.createElement('option');
            option.textContent = student.name;
            studentSelect.appendChild(option);
        });

        // Populate parent dropdown based on selected student
        studentSelect.addEventListener('change', function() {
            const selectedStudent = studentSelect.value;
            const selectedParent = students.find(student => student.name === selectedStudent).parent;
            
            // Clear previous options
            parentSelect.innerHTML = '';

            // Create option for parent
            const parentOption = document.createElement('option');
            parentOption.textContent = selectedParent;
            parentSelect.appendChild(parentOption);
        });
    }

    // Function to handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedStudent = studentSelect.value;
        const selectedParent = parentSelect.value;
        const currentTime = new Date().toLocaleString();

        // Log entry
        const logEntry = `${selectedStudent},${selectedParent},${currentTime}\n`;

        // Display log entry on the page
        const listItem = document.createElement('li');
        listItem.textContent = `${selectedStudent} - Parent: ${selectedParent} - Time: ${currentTime}`;
        logList.appendChild(listItem);

        // Append log entry to CSV file hosted on GitHub
        const csvFilePath = 'https://raw.githubusercontent.com/your-username/your-repository/main/signout-log.csv'; // Replace with your GitHub CSV file path
        const csvData = new Blob([logEntry], { type: 'text/csv' });

        fetch(csvFilePath, {
            method: 'POST',
            body: csvData,
            mode: 'cors',
            headers: {
                'Content-Type': 'text/csv',
            }
        }).then(response => {
            console.log('Entry added to CSV file.');
        }).catch(error => {
            console.error('Error adding entry to CSV file:', error);
        });

        // Reset form
        form.reset();
    });

    // Load student data from CSV and populate dropdowns
    const csvUrl = 'data/students.csv'; // Replace with your CSV file path
    fetchDataFromCSV(csvUrl)
        .then(students => populateDropdowns(students))
        .catch(error => console.error('Error fetching data:', error));
});