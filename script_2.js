function showPopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'block';
    setTimeout(function() {
        popup.style.display = 'none';
    }, 5000); // 5 segundos
}

function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
}
