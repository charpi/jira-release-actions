
[![build-test](https://github.com/Justin-JHG/jira-release-actions/actions/workflows/test.yml/badge.svg)](https://github.com/Justin-JHG/jira-release-actions/actions/workflows/test.yml)

# Jira Release/Archive Action 

This Github action connects your CI and your Jira instance by creating release(Fix Version) and assign Jira issues to the release as part of your CI process.

- Create a JIRA release (Fix Version), release date will be today's date in UTC.
- Assign JIRA Issue Key to the release (Fix Version)
- Release can be created as archived as well


## Usage

Example workflow:

```yaml
jobs:
  release-fix-version:
    name: Release Jira Fix Version
    runs-on: ubuntu-latest
    steps:
      uses: justin-jhg/jira-release-actions@v1.0
      with:
        jira_base_url: ${{ secrets.JIRA_BASE_URL }}
        jira_user_email: ${{ secrets.JIRA_USER_EMAIL }}
        jira_api_token: ${{ secrets.JIRA_API_TOKEN }}
        jira_project: CI
        release_name: v9.0.2
        tickets: CI-123,CI-456
        release: true
        archive: false
```

----

## Action Spec:

### Inputs

|Name |Description |Required? |Type |
|---|---|---|---|
| jira_base_url  | URL of Jira instance. Example: `https://<yourdomain>.atlassian.net` | Yes | String |
| jira_api_token | **Access Token** for Authorization. Example: `HXe8DGg1iJd2AopzyxkFB7F2` ([How To](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)) | Yes | String |
| jira_user_email | email of the user for which **Access Token** was created for . Example: `human@example.com` | Yes | String |
| jira_project | Key of the jira project | Yes | String |
| release_name | Name of the release (Fix Version) | Yes | String |
| release | Mark Jira fix version as released. Defaults to false. | No | Boolean |
| archive | Mark Jira fix version as archived. Defaults to false. | No | Boolean |
| tickets | Comma-separated list of Jira Issue Keys to include in the release. Defaults to ''. | No | String |



## Reference

* [Jira Basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/)
* [Repository the code was forked from](https://github.com/StalemateInc/jira-release-action)
* https://github.com/actions/typescript-action
* https://github.com/vercel/ncc
