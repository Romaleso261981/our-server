// const https = require('https')
// const fs = require('fs')
// const WebSocket = require('ws')

// const server = https.createServer({
// 	cert: fs.readFileSync('path/to/your/certificate.crt'),
// 	key: fs.readFileSync('path/to/your/private/key.key'),
// })

const ws = require('ws')

const wss = new ws.Server(
	{
		port: 8080,
	},
	() => console.log(`Server started on 8080`)
)

wss.on('connection', function connection(ws) {
	ws.on('message', function (message) {
		message = JSON.parse(message)
		switch (message.event) {
			case 'message':
				broadcastMessage(message)
				break
			case 'connection':
				broadcastMessage(message)
				break
		}
	})
})

function broadcastMessage(message, id) {
	wss.clients.forEach(client => {
		client.send(JSON.stringify(message))
	})
}
