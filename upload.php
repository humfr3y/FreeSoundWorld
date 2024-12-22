<?php
include 'db_connect.php';
require_once '/xampp/htdocs/FreeSoundWorld/getID3-1.9.23/getID3/getid3/getid3.php';

$title = $_POST['title'];
$author = $_POST['author'];
$genres = $_POST['genres'];
$file_name = $_FILES['song']['name'];
$file_tmp_name = $_FILES['song']['tmp_name'];

// Проверка типа файла: допустим только аудиофайлы формата MP3
$allowed_extensions = array('mp3');
$file_extension = pathinfo($file_name, PATHINFO_EXTENSION);

if (!in_array(strtolower($file_extension), $allowed_extensions)) {
    die("Ошибка: Пожалуйста, загрузите файл в формате MP3.");
}

$file_path = 'audio/' . basename($file_name);

// Используем getID3 для получения длительности аудиофайла в секундах
$getID3 = new getID3();
$file_info = $getID3->analyze($file_tmp_name);
$duration_seconds = $file_info['playtime_seconds']; // Получаем длительность в секундах

// Преобразуем длительность в формат ЧЧ:ММ:СС
$hours = floor($duration_seconds / 3600);
$minutes = floor(($duration_seconds / 60) % 60);
$seconds = $duration_seconds % 60;
$duration = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);

if (move_uploaded_file($file_tmp_name, $file_path)) {
    $sql = "INSERT INTO songs (title, author, genres, duration, file_path) VALUES ('$title', '$author', '$genres', '$duration', '$file_path')";
    if ($conn->query($sql) === TRUE) {
        echo "Новая песня успешно добавлена<br>";
        echo '<a href="index.html">Вернуться на сайт</a>'; // Добавляем ссылку на главную страницу
    } else {
        echo "Ошибка: " . $sql . "<br>" . $conn->error;
    }
} else {
    echo "Ошибка при загрузке файла";
}

$conn->close();
?>
