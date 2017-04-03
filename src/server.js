import net from 'net'
import logger from 'winston-color'

const server = net.createServer()
const port = process.env.PORT || 8000
const environment = process.env.NODE_ENV || 'development'
const hostname = process.env.HOSTNAME

server.on('listening', () => {
  logger.info('listening on', port)
})

server.on('connection', handleConnection)

server.listen(port, hostname)

function handleConnection (socket) {
  logger.info('client connected')
  socket.on('error', handleError)
  socket.on('close', handleClose)
  
  function handleError (err) {
    logger.info("error:", err.message)
  }
  
  function handleClose () {
    logger.warn('connection closed')
  }
}