# Jira Release Action v3

This Github action connects your CI and your Jira instance by creating releases as part of your CI process.

The action can either mark an existing release as released or directly create a new one base on a tag name.
The action can also automatically update the 'Fix Version' field of a list of Jira issues.

## Usage

### Input

| Name | Description | Required? | Type |
|---|---|---|---|
| email  | Email address used to log into Jira account | Yes | String |
| api_token | Jira API token | Yes | String |
| subdomain | Subdomain of your Jira project, '[domain].atlassian.net' | Yes | String |
| jira_project | Key of the jira project | Yes | String |
| release_name | Name of the release | Yes | String |
| create | Create a Jira release. Defaults to false. | No | Boolean |
| release | Mark Jira version as released. Defaults to false. | No | Boolean |
| tickets | Comma-separated list of ticket IDs to include in the release. Defaults to ''. | No | String |
| dry_run | Perform only read actions and show the logs. Defaults to false. | No | 'ci' / true / false |


### Example

```yaml
jobs:
 get-next-app-version:
    name: Get App Version Number
    runs-on: ubuntu-latest
    outputs:
      version-id: ${{ steps.get-version.outputs.id }}
    steps:
      ...gets the latest version

  release-next-app-version:
    name: Release Jira Version
    runs-on: ubuntu-latest
    steps:
      uses: StalemateInc/jira-release-action@latest
      with:
        email: ${{ secrets.JIRA_EMAIL }}
        api_token: ${{ secrets.JIRA_TOKEN }}
        release_name: ${{ needs.get-next-app-version.outputs.version-id }}
        tickets: PROJ-1234,PROJ-5678
        subdomain: example
        jira_project: PROJ
        create: true
        release: true
```

## Q&A

*Q*: Why use the Basic auth for Jira REST API and not something more secure like OAuth2?

*A*: OAuth the Atlassian provides is a 3-leg flow, not suitable for server-server comminications without a direct user involvment. Seems like 2-leg flow was supported long ago, but after some time was silently removed from the API, so it is no longer an option. Contributions to suggestions to replace the Basic auth with a different, more secure auth method, given that is supported by Atlassian, are welcome.

## Reference

* [Jira Basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/)
* [Code inspiration](https://github.com/jimyang-9/release-jira-fix-version/)
* [Repository the code was forked from](https://github.com/armona/jira-release-actions)
