import net from 'net'
import logger from 'winston-color'
import DuplexEmitter from 'duplex-emitter'
import chalk from 'chalk'
import json_data from './data.json'

const server = net.createServer()
const port = process.env.PORT || 55445
const hostname = process.env.HOSTNAME

server.on('listening', () => {
  logger.info(chalk.magenta(`listening on port ${port}...`))
})

server.on('connection', handleConnection)

server.listen(port, hostname)

function handleConnection (socket) {
  logger.info('client connected...')
  
  socket.on('error', handleError)
  socket.on('close', handleClose)
  
  const emitter = DuplexEmitter(socket)
  emitter.emit('json-data', json_data)
  emitter.on('complete', (data) => {
    emitter.emit('confirmaiton', 'confirmed received...')
  logger.info(chalk.cyan(data))
  })
  
  function handleError (err) {
    logger.info("error:", err.message)
  }
  
  function handleClose () {
    logger.warn('connection closed...')
  }
}
