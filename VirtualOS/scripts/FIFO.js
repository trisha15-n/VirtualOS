var string = [];
        var pageFaults = 0;
        var frames = 0;
        var pages = 0;
        var temp = [];
        var m = 0; // Step counter
        var queue = []; // Queue for FIFO logic

        function startFIFO() {
            var stringInput = document.getElementById('stringInput').value;
            var frameInput = document.getElementById('frameInput').value;
            if (!stringInput) {
                alert("Please enter a valid string.");
                return;
            }
            string = stringInput.split(',').map(Number);
            pages = string.length;
            frames = parseInt(frameInput);

            // Reset the table display
            document.getElementById('incomingRow').innerHTML = '<th>Incoming</th>';
            var frameRowsHTML = '';
            for (var i = 0; i < frames; i++) {
                frameRowsHTML += '<tr id="frame' + (i + 1) + 'Row"><th>Frame ' + (i + 1) + '</th></tr>';
            }
            document.getElementById('frameRows').innerHTML = frameRowsHTML;
            document.getElementById('pageFaultRow').innerHTML = '<th>Page Fault</th>';
            document.getElementById('pageFaults').textContent = 'Total Page Faults: ';
            document.getElementById('nextStepButton').style.display = 'block'; // Show "Next Step" button

            pageFaults = 0;
            temp = []; // Initialize frames as an empty array
            queue = []; // Reset queue
            m = 0; // Reset step counter

            document.getElementById('outputMessage').style.display = 'none'; // Hide the placeholder message
            document.getElementById('outputTable').style.display = 'table'; // Show the table
            document.getElementById('queueTitle').style.display = 'block'; // Show queue title

            // Disable input while processing
            document.getElementById('stringInput').disabled = true;
            document.getElementById('frameInput').disabled = true;
        }

        function displayNextStep() {
            if (m >= pages) {
                document.getElementById('pageFaults').textContent = `Total Page Faults: ${pageFaults}`;
                document.getElementById('pageFaults').style.display = 'block'; // Show total page faults
                document.getElementById('nextStepButton').style.display = 'none'; // Hide button when steps are done
                document.getElementById('stringInput').disabled = false; // Re-enable input
                document.getElementById('frameInput').disabled = false; // Re-enable input
                return;
            }

            // FIFO logic
            var pageFaultOccurred = false;
            let replacedPage = null; // To track the replaced page

            if (!temp.includes(string[m])) { // Page fault occurs
                pageFaultOccurred = true;
                if (temp.length < frames) {
                    temp.push(string[m]); // Add new page
                    queue.push(string[m]); // Add to queue
                } else {
                    replacedPage = queue.shift(); // Remove oldest page from queue
                    queue.push(string[m]); // Add new page to queue
                    const frameIndex = temp.indexOf(replacedPage);
                    temp[frameIndex] = string[m]; // Replace the page in frames
                }
                pageFaults++;
            }

            // Update the incoming row
            document.getElementById('incomingRow').innerHTML += '<th>' + string[m] + '</th>';

            // Update the frame rows
            for (var i = 0; i < frames; i++) {
                document.getElementById('frame' + (i + 1) + 'Row').innerHTML += '<td>' + (temp[i] === undefined ? '-' : temp[i]) + '</td>';
            }

            // Update queue display
            document.getElementById('queueDisplay').innerHTML = ''; // Clear previous queue
            for (var i = 0; i < queue.length; i++) {
                const queueItem = document.createElement('div');
                queueItem.className = 'queue-item';
                queueItem.textContent = queue[i];

                const queueLabel = document.createElement('div');
                queueLabel.className = 'queue-label';
                if (i === 0) {
                    queueLabel.textContent = 'Head'; // Mark head
                } 
                if (i === queue.length - 1 && queue.length > 1 && queue[i - 1] !== queue[i]) {
                    queueLabel.textContent = 'Tail'; // Mark tail
                }
                queueItem.appendChild(queueLabel);

                if (i === 0) {
                    queueItem.classList.add('queue-head'); // Highlight head
                } 
                if (i === queue.length - 1 && (queue.length === 1 || queue[i - 1] !== queue[i])) {
                    queueItem.classList.add('queue-tail'); // Highlight tail
                }
                
                document.getElementById('queueDisplay').appendChild(queueItem);
            }

            // Show replaced message only when page fault occurs and a page is replaced
            if (pageFaultOccurred && replacedPage !== null) {
                const replaced = document.createElement('div');
                replaced.className = 'replaced';
                replaced.textContent = 'Replaced: ' + replacedPage;
                document.getElementById('replacedContainer').innerHTML = ''; // Clear previous replaced messages
                document.getElementById('replacedContainer').appendChild(replaced);
            } else {
                document.getElementById('replacedContainer').innerHTML = ''; // Clear replaced messages if not applicable
            }

            // Update the page fault row
            document.getElementById('pageFaultRow').innerHTML += '<td>' + (pageFaultOccurred ? 'Yes' : 'No') + '</td>';

            m++;
        }

        function resetFields() {
            document.getElementById('stringInput').value = '';
            document.getElementById('frameInput').value = 3;
            document.getElementById('outputMessage').style.display = 'block'; // Show placeholder message
            document.getElementById('outputTable').style.display = 'none'; // Hide the table
            document.getElementById('queueTitle').style.display = 'none'; // Hide queue title
            document.getElementById('queueDisplay').innerHTML = ''; // Clear queue
            document.getElementById('replacedContainer').innerHTML = ''; // Clear replaced messages
            document.getElementById('pageFaultRow').innerHTML = '<th>Page Fault</th>'; // Reset page fault row
            document.getElementById('pageFaults').style.display = 'none'; // Hide total page faults
            document.getElementById('nextStepButton').style.display = 'none'; // Hide next step button
            // Re-enable input
            document.getElementById('stringInput').disabled = false;
            document.getElementById('frameInput').disabled = false;
        }