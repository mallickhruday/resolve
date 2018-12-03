const dispose = ({ metaApi, internalContext }, options = {}) => {
  if (options != null && options.constructor !== Object) {
    throw new Error('Dispose options should be plain object if provided')
  }

  if (internalContext.disposePromise) {
    return internalContext.disposePromise
  }

  const disposePromise = (async () => {
    if (Object.keys(options).length > 0) {
      await metaApi.drop(options)
    }
    await metaApi.disconnect()
  })()

  Object.keys(internalContext).forEach(key => {
    delete internalContext[key]
  })

  internalContext.disposePromise = disposePromise
  return disposePromise
}

export default dispose
