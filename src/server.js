import net from 'net'
import logger from 'winston-color'
import DuplexEmitter from 'duplex-emitter'
import chalk from 'chalk'

const server = net.createServer()
const port = process.env.PORT || 8000
const hostname = process.env.HOSTNAME

server.on('listening', () => {
  logger.info(chalk.magenta(`listening on port ${port}...`))
})

server.on('connection', handleConnection)

server.listen(port, hostname)

const data = {
  "id": 1,
  "name": "testName"
}

function handleConnection (socket) {
  logger.info('client connected')
  socket.on('error', handleError)
  socket.on('close', handleClose)
  
  const remoteEmitter = DuplexEmitter(socket)
  remoteEmitter.emit('msg', data)
  
  function handleError (err) {
    logger.info("error:", err.message)
  }
  
  function handleClose () {
    logger.warn('connection closed')
  }
}
