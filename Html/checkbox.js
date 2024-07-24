document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        const checkmark = checkbox.nextElementSibling.querySelector('a');

        // Load checkbox state from localStorage
        const isChecked = localStorage.getItem(checkbox.id) === 'true';
        checkbox.checked = isChecked;

        // Apply the strike-through style if the checkbox is checked
        if (isChecked) {
            checkBox(checkbox, checkmark);
        }

        // Save checkbox state to localStorage on change
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;

            if (isChecked) {
                checkBox(checkbox, checkmark);
            } else {
                uncheckBox(checkbox, checkmark);
            }
        });
    });
});
function checkBox(checkbox, checkmark) {
    localStorage.setItem(checkbox.id, 'true');
    checkmark.style.textDecoration = 'line-through';
    checkmark.style.color = 'gray';
}

function uncheckBox(checkbox, checkmark) {
    localStorage.removeItem(checkbox.id);
    checkmark.style.textDecoration = 'none';
    checkmark.style.color = 'blue';
}
function saveToFile() {
	const path = window.location.pathname;
	const fileNameWithoutExtension = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
	
	// Use the extracted file name as the default file name
	const fileName = `${fileNameWithoutExtension}.json`;

	// Create an array of keys from localStorage
	const keysArray = Object.keys(localStorage);
	
	const data = JSON.stringify(keysArray);
	const blob = new Blob([data], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.click();
	URL.revokeObjectURL(url);
}
function loadFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        
        if (!file) {
            alert('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContents = event.target.result;
            const idsToCheck = JSON.parse(fileContents);
            checkAllBoxes(idsToCheck);
        };
        reader.readAsText(file);
    };

    fileInput.click();
}

function checkAllBoxes(idsToCheck) {
    idsToCheck.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
			checkbox.checked = true;
            const checkmark = checkbox.nextElementSibling.querySelector('a');
            checkBox(checkbox, checkmark);
        }
    });
}