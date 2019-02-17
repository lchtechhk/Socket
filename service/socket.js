module.exports = {
    create_socket : function(http){
        var io = require("/usr/local/lib/node_modules/socket.io")(http);
        var Usercounter = 0;
        const nicknames = {};
        var room1 = {
            id : 1,
            name : "room1",
            status : "active",
            type : "public"
        }
        var room2= {
            id : 2,
            name : "room2",
            status : "active",
            type : "public"
        }

        const rooms = {
            room1: {room: room1,count:0},
            room2: {room: room2,count:0},
        };
        function checkroom(rooms, room) {
            var ret = false;
            for(var key in rooms){
                if(key == room){
                    ret = true;
                }
            }
            return ret;
        }
       
        io.on("connection", (socket)=> {
            console.log('connection : ' );
            socket.on('setnickname', (name)=>{
                console.log('user_name : '+name);
                if(typeof nicknames[name] === 'undefined') {
                    nicknames[name] = {count: 0};
                    socket.emit('nicknamesuccess', name);
                    socket['nickname'] = name;
                } else {
                    nicknames[name].count++;
                    var t = name + '' + nicknames[name].count;
                    socket.emit('nicknamefail', t);
                    socket['nickname'] = t;
                }
            });
            socket.on('join', function(channel) {
                console.log('channel : ' + channel);
                if(checkroom(rooms, channel)) {
                    socket.join(channel);
                    var entry_count = rooms[channel].count;
                    rooms[channel].count = entry_count + 1;
                    console.log('entry_count : ' + rooms[channel].count);

                    
                    socket.emit('joinroomsuccess', {channel:channel});// 4
                    console.log('Usercounter : ' + rooms[channel].count);
                    io.emit("user", rooms[channel].count);
                }
                socket.on("disconnect", () =>{
                    var entry_count = rooms[channel].count;
                    rooms[channel].count = entry_count - 1;
                    io.emit("user", rooms[channel].count);
                    console.log("user disconnected");
                });
            });
            socket.on("leave", (channel) =>{
                var entry_count = rooms[channel].count;
                rooms[channel].count = entry_count - 1;
                io.emit("user", rooms[channel].count);
                console.log("user disconnected");
            });
            
            
            socket.on("audioMessage", function(msg) {
                io.emit("audioMessage", msg);
            });
        });
    },
    // create_socket : function(http){
    //     var io = require("/usr/local/lib/node_modules/socket.io")(http);
    //     var Usercounter = 0;
    //     io.on("connection", function(socket) {
    //     Usercounter = Usercounter + 1;
    //     io.emit("user", Usercounter);
    //         console.log("a user is connected");
    //         socket.on("disconnect", function() {
    //             Usercounter = Usercounter - 1;
    //             io.emit("user", Usercounter);
    //             console.log("user disconnected");
    //         });
    //         socket.on("audioMessage", function(msg) {
    //             io.emit("audioMessage", msg);
    //         });
    //     });
    // }
}