<?php
include 'db_connect.php';

$sql = "SELECT id, title, author, genres, duration, file_path FROM songs";
$result = $conn->query($sql);

$songs = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
}

$conn->close();

echo json_encode($songs);
?>
