import _ from 'lodash'

export const  getLatestConfigSchema = ({latest, versions}) => {
  if (_.isEmpty(latest)) return null
  if (_.isEmpty(versions)) return null

  const latestVersion = _.find(versions, { version: latest })

  if (_.isEmpty(latestVersion)) return null

  return latestVersion.schemas.configure.bluprint
}
