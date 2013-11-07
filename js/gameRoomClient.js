var socket = io.connect('142.4.210.12:8127');
var room;

function updateUserListTable(players){
    $('#playerTable').children().remove();
    var tableHTML = "<thead><tr> <th>#</th><th>Player Name</th><th>Status</th><th>Invite</th></tr></thead>";
    var i = 0
    for (var key in players){
        tableHTML = tableHTML + "<tr><td>"+i+"</td><td>"+players[key].name+"</td><td>Waiting</td><td><input type=\"checkbox\" id=\"check"+players[key]+"\"></td></tr>";
        i++;
    }
    $('#playerTable').append(tableHTML);
}



$(document).ready(function() {

	//socket.emit('getRoomInfo');

	//socket.on

    socket.on("setRoom", function(clientRoom){
        room = clientRoom;
    });

});