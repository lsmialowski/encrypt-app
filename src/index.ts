import { Container } from 'typedi'
import { Logger } from 'winston'
import config, { DEFAULT_ENV } from './app/config'
import logger from './app/logger'
import server from './app/server'
import * as path from 'path'

// Set environment variable APP_ROOT
process.env.APP_ROOT = path.resolve(__dirname, '..')

// config init
config()

// logger init
logger()
const log: Logger = Container.get('logger')

log.info('Booting application...')

// Check environment variable NODE_ENV
if (!process.env.NODE_ENV) {
  log.warn('Environment variable NODE_ENV is not set!')
  log.warn(`Using default environment which is: ${DEFAULT_ENV}`)

  // Set default environment
  process.env.NODE_ENV = DEFAULT_ENV
} else {
  log.info(`Using environment: ${process.env.NODE_ENV}`)
}

function handleError (error: any) {
  log.error(
    (Object.prototype.hasOwnProperty.call(error, 'bar')) ? error.message : JSON.stringify(error),
    (Object.prototype.hasOwnProperty.call(error, 'stack')) ? error.stack : []
  )
}

// Handle unhandled exceptions
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

// server init
server().catch((error: Error) => {
  handleError(error)
  log.info('Application has failed to initialize!')
  process.exit()
})
