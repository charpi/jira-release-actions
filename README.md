# Jira Release Action

<p align="center">
  <a href="https://github.com/charpi/jira-release-actions"><img alt="jira-release-action status" src="https://github.com/carpi/jira-release-actions/workflows/build-test/badge.svg"></a>
</p>

This Github action connects your CI and your Jira instance by creating releases as part of your CI process.

The action can either mark an existing release as released or directly create a new one base on a tag name.
The action can also automatically update the 'Fix Version' field of a list of Jira issues.

## Usage

### Input

| Name | Description | Required |
|---|---|---|
| email  | Jira login | Y |
| api_token | Jira api token | Y |
| subdomain | Jira cloud instance. '[domain].atlassian.net' | Y |
| jira_project | Key of the jira project | Y |
| release_name | Name of the release | Y |
| create | Boolean. Create automatically a jira release| N (default: false ) |
| unrlease | Boolean. Create the Jira release as unreleased| N (default: false ) |
| tickets | Comma separated list of ticket IDs to include in the release. Update the first release-version. | N (default: '') |
| dry_run | Dump actions that would be taken | N (default: false) |


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
      uses: charpi/jira-release-action@latest
      with:
        email: ${{ secrets.JIRA_EMAIL }}
        api-token: ${{ secrets.JIRA_TOKEN }}
        subdomain: example
        release_name: ${{ needs.get-next-app-version.outputs.version-id}}
```

## Reference

* [Jira Basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/)
* [Code inspiration](https://github.com/jimyang-9/release-jira-fix-version/)
