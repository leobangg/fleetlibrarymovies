document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'AIzaSyA94v-PoQ8pb5Y5XrXdyxYQd85D8Z8nrEk';  
    const spreadsheetId = '1Sq6s8kKKyMo8KLRivAngsOvqk8B5ShiMXVIfPRlsTO8'; 
    const range = 'Sheet1!A2:G51'; 

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const entries = data.values;
        const galleryContainer = document.getElementById('gallery');
        const genreButtonsContainer = document.getElementById('genre-buttons');

        // Filter out empty or incomplete rows
        const validEntries = entries.filter(entry => entry.length === 7 && entry.every(cell => cell.trim() !== ''));

        const movieItems = [];
        const genresSet = new Set();

        validEntries.forEach(entry => {
            const title = entry[0];
            const director = entry[1];
            const boxOffice = entry[2];
            const genres = entry[3].split(',').map(genre => genre.trim());
            const year = entry[4];
            const watched = entry[5];
            const imgUrl = entry[6];

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('gallery-item');
            itemDiv.setAttribute('data-genres', genres.join(','));

            const imgElement = document.createElement('img');
            imgElement.src = imgUrl;
            imgElement.alt = title;

            const textDiv = document.createElement('div');
            textDiv.classList.add('text-content');

            const titleElement = document.createElement('p');
            titleElement.textContent = `Title: ${title}`;
            const directorElement = document.createElement('p');
            directorElement.textContent = `Director: ${director}`;
            const boxOfficeElement = document.createElement('p');
            boxOfficeElement.textContent = `Box Office: $${boxOffice}`;
            const genreElement = document.createElement('p');
            genreElement.textContent = `Genre: ${genres.join(', ')}`;
            const yearElement = document.createElement('p');
            yearElement.textContent = `Year: ${year}`;
            const watchedElement = document.createElement('p');
            watchedElement.textContent = `Watched: ${watched}`;

            textDiv.appendChild(titleElement);
            textDiv.appendChild(directorElement);
            textDiv.appendChild(boxOfficeElement);
            textDiv.appendChild(genreElement);
            textDiv.appendChild(yearElement);
            textDiv.appendChild(watchedElement);

            itemDiv.appendChild(imgElement);
            itemDiv.appendChild(textDiv);
            galleryContainer.appendChild(itemDiv);

            movieItems.push(itemDiv);

            genres.forEach(genre => genresSet.add(genre.trim()));

            imgElement.addEventListener('click', () => {
                itemDiv.classList.toggle('active');
            });
        });

        genresSet.forEach(genre => {
            const genreButton = document.createElement('button');
            genreButton.classList.add('genre-btn');
            genreButton.textContent = genre;
            genreButton.setAttribute('data-genre', genre);

            genreButton.addEventListener('click', () => {
                movieItems.forEach(item => {
                    const movieGenres = item.getAttribute('data-genres').split(',');
                    if (movieGenres.includes(genre)) {
                        item.classList.add('highlighted');
                    } else {
                        item.classList.remove('highlighted');
                    }
                });
            });

            genreButtonsContainer.appendChild(genreButton);
        });

        const clearButton = document.createElement('button');
        clearButton.textContent = "Clear Filter";
        clearButton.addEventListener('click', () => {
            movieItems.forEach(item => {
                item.classList.remove('highlighted');
            });
        });
        genreButtonsContainer.appendChild(clearButton);
    })
    .catch(error => console.error('Error fetching data:', error));
});