function logEntry(action) {
    const studentName = document.getElementById('students').value;
    const parentName = document.getElementById('parents').value;

    if (!studentName || !parentName) {
        alert('Please select both student and parent.');
        return;
    }

    const entry = {
        studentName: studentName,
        parentName: parentName,
        action: action
    };

    fetch('/log-entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function viewEntries() {
    const date = document.getElementById('viewDate').value;

    fetch(`/entries?date=${date}`)
    .then(response => response.json())
    .then(data => {
        const logTable = document.getElementById('attendanceLog').getElementsByTagName('tbody')[0];
        logTable.innerHTML = '';

        data.forEach(entry => {
            const newRow = logTable.insertRow();

            const nameCell = newRow.insertCell(0);
            const parentCell = newRow.insertCell(1);
            const actionCell = newRow.insertCell(2);
            const timeCell = newRow.insertCell(3);

            nameCell.textContent = entry['Student Name'];
            parentCell.textContent = entry['Parent Name'];
            actionCell.textContent = entry['Action'];
            timeCell.textContent = new Date(entry['Time']).toLocaleString();
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}