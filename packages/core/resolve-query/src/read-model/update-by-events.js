const updateByEvents = async (repository, events) => {
  if (!Array.isArray(events)) {
    throw new Error('Updating by events should supply events array')
  }
  if (repository.disposePromise) {
    throw new Error('Read model is disposed')
  }
  if (repository.projection == null) {
    throw new Error(
      'Updating by events is prohibited when projection is not specified'
    )
  }

  await repository.connect(repository)
  const lastDemandAccess = await repository.metaApi.pollDemandAccess()
  const elapsedTime = Math.max(Date.now() - lastDemandAccess, 0)

  if (elapsedTime > 60 * 60 * 1000) {
    try {
      await repository.loadEvents(repository)
    } catch (err) {}
  }

  try {
    let hasReorderedEvents = false

    for (const event of events) {
      if (repository.eventTypes.indexOf(event.type) < 0) continue
      const applyResult = await repository.boundProjectionInvoker(event, true)

      if (applyResult === 'REORDERED_EVENT') {
        hasReorderedEvents = true
        break
      }
    }

    if (hasReorderedEvents) {
      await repository.loadEvents(repository)
    }
  } catch (err) {}
}

export default updateByEvents
