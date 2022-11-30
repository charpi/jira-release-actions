# Jira Release/Archive Action 

This Github action connects your CI and your Jira instance by creating release and assign Jira issues to the release as part of your CI process.

- Create a JIRA release (Fix Version)
- Assign JIRA Issue Key to the release (Fix Version)
- Release can be created/updated to released or archived


## Usage

### Input

| Name | Description | Required? | Type |
|---|---|---|---|
| email  | Email address used to log into Jira account | Yes | String |
| api_token | Jira API token | Yes | String |
| subdomain | Subdomain of your Jira project, '[domain].atlassian.net' | Yes | String |
| jira_project | Key of the jira project | Yes | String |
| release_name | Name of the release, Fix Version name | Yes | String |
| create | Create a Jira release. Defaults to false. | No | Boolean |
| release | Mark Jira fix version as released. Defaults to false. | No | Boolean |
| archive | Mark Jira fix version as archived. Defaults to false. | No | Boolean |
| tickets | Comma-separated list of Jira Issue Keys to include in the release. Defaults to ''. | No | String |
| dry_run | Perform only read actions and show the logs. Defaults to false. | No | 'ci' / true / false |


### Example

```yaml
jobs:
  release-fix-version:
    name: Release Jira Fix Version
    runs-on: ubuntu-latest
    steps:
      uses: justin-jhg/jira-release-actions@v0.2
      with:
        email: ${{ secrets.JIRA_EMAIL }}
        api_token: ${{ secrets.JIRA_TOKEN }}
        release_name: v9.0.2
        tickets: PROJ-1234,PROJ-5678
        subdomain: companyname
        jira_project: PROJ
        create: true
        release: true
        archive: false
```

## Reference

* [Jira Basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/)
* [Repository the code was forked from](https://github.com/StalemateInc/jira-release-action)
* https://github.com/actions/typescript-action
* https://github.com/vercel/ncc
