document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const inputField = document.getElementById('searchInput');
    const musicList = document.querySelector('.music-list');
    let songs = []; // Объявляем пустой массив для хранения песен
    let audioPlayer = null; // Переменная для текущего проигрывателя аудио

    // Функция для запроса песен из базы данных
    function fetchSongs() {
        fetch('list.php') // Используем list.php для получения списка песен
            .then(response => response.json())
            .then(data => {
                songs = data; // Сохраняем полученные песни в массив
                displaySongs(songs); // Показываем все песни при загрузке страницы
            })
            .catch(error => console.error('Error fetching songs:', error));
    }

    // Функция для отображения найденных песен
    function displaySongs(filteredSongs) {
        musicList.innerHTML = ''; // Очищаем список песен перед отображением новых результатов
        filteredSongs.forEach(song => {
            const musicBlock = document.createElement('div');
            musicBlock.classList.add('music-block');

            // Создаем элементы для отображения информации о песне и добавляем их в блок музыки
            const duration = document.createElement('div');
            duration.classList.add('duration');
            duration.textContent = song.duration;
            musicBlock.appendChild(duration);

            const info = document.createElement('div');
            info.classList.add('info');

            const author = document.createElement('div');
            author.classList.add('author');
            author.textContent = song.author;
            info.appendChild(author);

            const songTitle = document.createElement('div');
            songTitle.classList.add('song');
            songTitle.textContent = song.title;
            info.appendChild(songTitle);

            const genres = document.createElement('div');
            genres.classList.add('genres');
            genres.textContent = 'Жанры: ' + song.genres;
            info.appendChild(genres);

            musicBlock.appendChild(info);

            const actions = document.createElement('div');
            actions.classList.add('actions');

            const audio = new Audio(song.file_path); // Создаем объект Audio для текущей песни

            const audioPlayerDiv = document.createElement('div');
            audioPlayerDiv.classList.add('audio-player');
            audioPlayerDiv.dataset.src = song.file_path;

            const timeDisplay = document.createElement('div');
            timeDisplay.classList.add('time-display');
            timeDisplay.textContent = `00:00:00/${song.duration}`;
            audioPlayerDiv.appendChild(timeDisplay);

            const playPauseButton = document.createElement('button');
            playPauseButton.classList.add('play-pause');
            playPauseButton.textContent = '⏵︎';
            audioPlayerDiv.appendChild(playPauseButton);

            const progressContainer = document.createElement('div');
            progressContainer.classList.add('progress-container');
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            progressContainer.appendChild(progressBar);
            audioPlayerDiv.appendChild(progressContainer);

            actions.appendChild(audioPlayerDiv);

            const downloadButton = document.createElement('button');
            downloadButton.textContent = '⬇';
            downloadButton.addEventListener('click', function () {
                const anchor = document.createElement('a');
                anchor.href = song.file_path;
                anchor.download = song.title + '.mp3'; // Указываем имя файла для скачивания, можно настроить как угодно
                anchor.click();
            });
            
            actions.appendChild(downloadButton);

            musicBlock.appendChild(actions);

            musicList.appendChild(musicBlock);

            // Обработчик для кнопки воспроизведения/паузы
            playPauseButton.addEventListener('click', function () {
                if (audio.paused) {
                    if (audioPlayer && audioPlayer !== audio) {
                        audioPlayer.pause();
                        audioPlayer.currentTime = 0;
                        const currentPlayPauseButton = musicList.querySelector('.play-pause[data-src="' + audioPlayer.src + '"]');
                        if (currentPlayPauseButton) {
                            currentPlayPauseButton.textContent = '⏵︎';
                        }
                    }
                    audio.play();
                    playPauseButton.textContent = '⏸';
                    audioPlayer = audio;
                } else {
                    audio.pause();
                    playPauseButton.textContent = '⏵︎';
                }

                // Обновляем время воспроизведения и полосу прогресса
                audio.addEventListener('timeupdate', function () {
                    const minutes = Math.floor(audio.currentTime / 60);
                    const seconds = Math.floor(audio.currentTime % 60);
                    const durationMinutes = Math.floor(audio.duration / 60);
                    const durationSeconds = Math.floor(audio.duration % 60);
                    timeDisplay.textContent = `00:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}/00:${durationMinutes < 10 ? '0' : ''}${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
                    progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
                });

                // Обработчик клика для перемотки трека с помощью прогресс-бара
                progressContainer.addEventListener('click', function (event) {
                    const rect = progressContainer.getBoundingClientRect();
                    const offsetX = event.clientX - rect.left;
                    const seekTime = audio.duration * (offsetX / rect.width);
                    audio.currentTime = seekTime;
                });
            });
        });
    }

    // Обработчик события для кнопки "Начать поиск"
    searchButton.addEventListener('click', function () {
        const searchText = inputField.value.toLowerCase().trim();
        const filteredSongs = songs.filter(song => {
            return song.title.toLowerCase().includes(searchText) || song.author.toLowerCase().includes(searchText);
        });

        displaySongs(filteredSongs);
    });

    // Вызываем функцию для запроса песен из базы данных при загрузке страницы
    fetchSongs();
});
